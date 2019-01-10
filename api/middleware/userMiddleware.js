var mongoose = require('mongoose');
Entity = mongoose.model('Entities');
Activity = mongoose.model('Activities');
var user = require('../controllers/userController');

var async = require('async');
var geolib = require("geolib");


// maps an array to an object for mongoose selector query
function mapDictionary(array) {
	let ret = {}
	array.forEach(item => {
		ret[item] = '1';
	});
	return ret;
}


// Asserts that the user does not exist. 
exports.userNotExists = function(req, res, next) {
	user.userNotExists(req.body, function(err, user) {
		if (err) return res.status(500).send();
		if (user) return res.status(406).send("The user already exists");
		else next();
	});
}

// Asserts that the intend to update the user actually belongs to the requester user
exports.userNotExistsOnUpdate = function(req, res, next) {
	let userId = req.params.userId;
	user.userNotExists(req.body, function(err, user) {
		if (err) return res.status(500).send();
		if (user) {
			if (user._id != userId) return res.status(406).send("invalid operation");
			else next();
		}
		else next();
	});
}

// Fills the request with the target used given its :userId specifid in the url parameters
exports.selectTargetUser = function(req, res, next) {
	User.findById(req.params.userId, function(err, user) {
		if (err) return res.send(err);
		else {
			if (!user) return res.status(404).send("User not found");
			else {
				req.targetUser = user;
				next();
			}
		}
	});
}

// Asserts that the target user of the request is the same as the requester or belongs
// to the requester entity in case the user type is 'entity'
exports.ownUserOrAllowedEntity = function(req, res, next) {
	let targetUser = req.params.userId;
	let requester = req.user;
	// if we are admin then all good
	if (requester.userType == 'admin') next();
	// if we are entity then just check we both have the same entity
	if (requester.userType == 'entity') {
		User.findById(targetUser, function(err, user) {
			if (err) return res.send(err);
			else {
				if (user.entity == requester.entity) {
					next();
				}
				else {
					return res.status(403).send("Not allowed to operate this user");
				}
			}
		});
	}
	// if we are normal then just check we have equal ids
	else if (requester.userType == 'normal') {
		if (targetUser == requester._id) next();
		else return res.status(403).send("Not allowed to operate this user");
	}
}

// checks that the target user is under the same entity as the requester
exports.allowedEntity = function(req, res, next) {
	if (req.user.entity.equals(req.targetUser.entity)) {
		next();
	}
	else return res.status(403).send("Not allowed to operate this user");
}

// checks that the target user is the same as the requester user
exports.allowedUser = function(req, res, next) {
	if (req.user.equals(req.targetUser)) {
		next();
	}
	else return res.status(403).send("Not allowed to operate this user");
}


// filters the attributes that will be queried by mongoose based on the user type
exports.selectUserAttributes = function(req, res, next) {
    let target = req.targetUser;
    let requester = req.user;

    let base = ['completeName','profilePic','username','points'];
    let own = base.concat(['email','birthday','phone','contactPhones','entity','createdAt','notifications','blocked']);
    let own_entity = own.concat(['userType','place','lastRequest','nRequests']);

    var attributes = [];
    if (requester.userType == 'entity' && requester.entity.equals(target.entity)) {
    	attributes = own_entity;
    }
    else if (target.equals(requester)) {

    	attributes = own;
    }
    else {
    	attributes = base;
    }
    req.userAttributes = mapDictionary(attributes);
    next();
}

// Selects entity attributes for an user query
exports.selectEntityUserAttributes = function(req, res, next) {

	let base = ['completeName','profilePic','username','points'];
    let own = base.concat(['email','birthday','phone','contactPhones','entity','createdAt','notifications','blocked']);
    let own_entity = own.concat(['userType','place','lastRequest','nRequests']);

	req.userAttributes = mapDictionary(own_entity);
	next();
}

// Adds user filters for requesters from entities
exports.selectUserFilters = function(req, res, next) {
	let requester = req.user;

	let filters = req.userFilters || {};

	let entity = requester.entity;

	filters['entity'] = entity._id;

	req.userFilters = filters;

	next();
}

// Asserts that the returned users will be from normal type
exports.selectNormalUsersFilter = function(req, res, next) {

	let filters = req.userFilters || {};

	filters['userType'] = 'normal';

	req.userFilters = filters;

	next();
}

// Asserts that the returned users will belong to the entity specified in the url parameter
exports.selectRequestEntityUsersFilter = function(req, res, next) {
	let entityId = req.params.entityId;

	let filters = req.userFilters || {};

	filters['entity'] = entityId;

	req.userFilters = filters;

	next();
}


// Selects the closest user entity
exports.getUserEntity = function(req, res, next) {
	let lat = req.body.lat;
	let long = req.body.long;

	Entity.find({}, function(err, entities) {
		if (err) return res.send(err);

		let choosen = {
			entity: false,
			distance: 12000 * 2
		};

		entities.forEach(entity => {
			let distance = geolib.getDistance(
	    		{latitude: lat, longitude: long},
	    		{latitude: entity.place.lat, longitude: entity.place.long}
	    	);
			if (distance <= entity.place.max && distance < choosen.distance) {
				choosen.entity = entity;
				choosen.distance = distance;
			}
		});

		req.entity = choosen.entity || undefined;
		next();
	});

}

// Purges references when an user is deleted
exports.onDeleteUser = function(req, res, next) {
	let userId = req.params.userId;

	// purge participants from activities
    Activity.updateMany({
        participants: userId
    }, {
        $pullAll: { participants: [userId] } 
    }).exec();

    // purges active from activities
    Activity.updateMany({
    	active: userId
    }, {
    	$pullAll: { active: [userId] }
    }).exec();

    // purges blocked users from users
    User.updateMany({
    	blocked: userId
    }, {
    	$pullAll: { blocked: [userId]}
    }).exec();

    // Delete all activities created by the user
    Activity.deleteMany({user: userId}).exec();
    next();
}

// Same as onDeleteUser but applied when we don't have the certainty on which users were deleted
exports.purgeReferences = function(req, res, next) {
    User.find({}).distinct('_id').exec(function(err, users) {
        if (err) return res.send(err);

        Activity.updateMany({

        }, {
            $pull: {
                participants: {
                	$nin: users
                }
            }
        }).exec();

        Activity.deleteMany({
            user: {
                $nin: users
            }
        }).exec();

        User.updateMany({

        }, {
        	$pull: {
        		blocked: {
        			$nin: users
        		}
        	}
        }).exec();

        next();
    });
}


// asserts that the target user is blocked by the requester
exports.userIsBlocked = function(req, res, next) {
	let user = req.user;
	let target = req.params.userId;

	User.countDocuments({
		_id: user._id,
		blocked: {
			$elemMatch:{
				'$eq': target
			} 
		}
	}, function(err, n){
		if (err) return res.send(err);
		else if (!n || n == 0) return res.status(404).send("user is not blocked!");
		else next();
	})
}

// asserts that the target usre is not blocked by the requester
exports.userIsNotBlocked = function(req, res, next) {
	let user = req.user;
	let target = req.params.userId;

	User.countDocuments({
		_id: user._id,
		blocked: {
			$elemMatch:{
				'$eq': target
			} 
		}
	}, function(err, n){
		if (err) return res.send(err);
		else if (n > 0) return res.status(404).send("user is already blocked!");
		else next();
	})
}

// asserts that the user has a location
exports.userHasLocation = function(req, res, next) {
	if (req.user.place.lat && req.user.place.long) {
		next();
	} else {
		res.status(400).send("User does not have coordinates");
	}
}

// adds query based filters on the mongo query
exports.populateUserFilters = function(req, res, next) {
	let userFilters = req.userFilters || {};

	let name = req.query.completeName;
	if (name && name.trim()) {
		name = name.trim();
		userFilters['completeName'] = {
			$regex: new RegExp(".*" + name + ".*","i")
		};
	}

	req.userFilters = userFilters;
	next();
}