var mongoose = require('mongoose');
Entity = mongoose.model('Entities');
Activity = mongoose.model('Activities');
var user = require('../controllers/userController');

var async = require('async');
var geolib = require("geolib");


exports.userNotExists = function(req, res, next) {
	user.userNotExists(req.body, function(err, user) {
		if (err) return res.status(500).send();
		if (user) return res.status(406).send("The user already exists");
		else next();
	});
}

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

exports.ownUserOrAllowedEntity = function(req, res, next) {
	let targetUser = req.params.userId;
	let requester = req.user;
	if (requester.userType == 'admin') next();
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
	else if (requester.userType == 'normal') {
		if (targetUser == requester._id) next();
		else return res.status(403).send("Not allowed to operate this user");
	}
}

exports.allowedEntity = function(req, res, next) {
	if (req.user.entity.equals(req.targetUser.entity)) {
		next();
	}
	else return res.status(403).send("Not allowed to operate this user");
}

exports.allowedUser = function(req, res, next) {
	if (req.user.equals(req.targetUser)) {
		next();
	}
	else return res.status(403).send("Not allowed to operate this user");
}

function mapDictionary(array) {
	let ret = {}
	array.forEach(item => {
		ret[item] = '1';
	});
	return ret;
}



exports.selectUserAttributes = function(req, res, next) {
    let target = req.targetUser;
    let requester = req.user;

    let base = ['completeName','profilePic','username'];
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

exports.selectEntityUserAttributes = function(req, res, next) {

	let base = ['completeName','profilePic','username'];
    let own = base.concat(['email','birthday','phone','contactPhones','entity','createdAt','notifications','blocked']);
    let own_entity = own.concat(['userType','place','lastRequest','nRequests']);

	req.userAttributes = mapDictionary(own_entity);
	next();
}

exports.selectUserFilters = function(req, res, next) {
	let requester = req.user;

	let filters = req.userFilters || {};

	let entity = requester.entity;

	filters['entity'] = entity._id;

	req.userFilters = filters;

	next();
}

exports.selectNormalUsersFilter = function(req, res, next) {

	let filters = req.userFilters || {};

	filters['userType'] = 'normal';

	req.userFilters = filters;

	next();
}

exports.selectRequestEntityUsersFilter = function(req, res, next) {
	let entityId = req.params.entityId;

	let filters = req.userFilters || {};

	filters['entity'] = entityId;

	req.userFilters = filters;

	next();
}

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


exports.onDeleteUser = function(req, res, next) {
	let userId = req.params.userId;

    Activity.update({
        participants: userId
    }, {
        $pullAll: { participants: [userId] } 
    }).exec();

    User.update({
    	blocked: userId
    }, {
    	$pullAll: { blocked: [userId]}
    }).exec();

    
    // Delete all activities created by the user
    Activity.remove({user: userId}).exec();
    next();
}

exports.purgeReferences = function(req, res, next) {
    User.find({}, function(err, users) {
        if (err) return res.send(err);

        /* TODO hacer que funcione y que tambien vaya el de blocked */
        /*
        Activity.update({

        }, {
            $pullAll: {
                participants: {
                    $nin: users
                }
            }
        })
        */
        Activity.remove({
            user: {
                $nin: users
            }
        }).exec();

        next();
    });
}


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

exports.userHasLocation = function(req, res, next) {
	if (req.user.place.lat && req.user.place.long) {
		next();
	} else {
		res.status(400).send("User does not have coordinates");
	}
}