var mongoose = require('mongoose');
Activity = mongoose.model('Activities');
var ctrl = require('../controllers/activityController');

var geolib = require("geolib");

// sets the request activity to the one specified in the url parameter
exports.populateActivity = function(req, res, next) {
	let activityId = req.params.activityId;

	if (!activityId) return res.status(400).send("Bad request");

	Activity.findOne({_id: activityId}, function(err, activity) {
		if (err) return res.send(err);
		if (!activity) return res.status(404).send("activity not found");
		req.activity = activity;
		next();
	});
}

// asserts that the user is a participant of the activity
exports.userInActivity = function(req, res, next) {
	let user = req.user;
	let activity = req.activity;

	Activity.count({
		_id: activity._id,
		participants: {
			$elemMatch:{
				'$eq': user._id
			} 
		}
	}, function(err, n){
		if (err) return res.send(err);
		else if (!n || n == 0) return res.status(404).send("user not in activity");
		else next();
	})
}

// asserts that the user is not a participant of the activity
exports.userNotInActivity = function(req, res, next) {
	let user = req.user;
	let activity = req.activity;

	Activity.count({
		_id: activity._id,
		participants: {
			$elemMatch:{
				'$eq': user._id
			} 
		}
	}, function(err, n){
		if (err) return res.send(err);
		else if (n > 0) return res.status(404).send("user in activity");
		else next();
	})
}

// asserts that the user voted on the activity
exports.userVoted = function(req, res, next) {
	let user = req.user;
	let activity = req.activity;

	Activity.count({
		_id: activity._id,
		votes: {
			$elemMatch: {
				user: user._id
			}
		}
	}, function(err, n){
		if (err) return res.send(err);
		else if (!n || n == 0) return res.status(404).send("user did not vote");
		else next();
	})
}

// asserts that the user did not vote on the activity
exports.userNotVoted = function(req, res, next) {
	let user = req.user;
	let activity = req.activity;
	Activity.count({
		_id: activity._id,
		votes: {
			$elemMatch: {
				user: user._id
			}
		}
	}, function(err, n){
		if (err) return res.send(err);
		else if (n > 0) return res.status(404).send("user already voted");
		else next();
	})
}

// sets the request entity to the closest one of the activity or undefined if it was not found
exports.getActivityEntity = function(req, res, next) {
	let user = req.user;
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

		if (!req.entity) 
			req.entity = choosen.entity;
		next();
	});

}

// Sets body user to the requester user (for updating purposes)
exports.getActivityUser = function(req, res, next) {
	let user = req.user;
	req.body.user = user._id;
	next();
}

// adds entity filters for entity queries 
exports.addEntityFilters = function(req, res, next) {
	let filters = req.activityFilters || {};

	filters.entity = req.entity._id;

	let title = req.query.title;
	if (title && title.trim()) {
		let titleQuery = {};
		titleQuery.$regex = new RegExp(".*" + title.trim() + ".*","i");
		filters['title'] = titleQuery;
	}

	req.activityFilters = filters;

	next();
}

// returns all blocked users from an user. Placed here for accessability
exports.getBlockedUsers = function(user,callback) {
	let blocked = user.blocked;

	User.find({blocked: user._id}).distinct('_id').exec(function(err, users) {
		if (err) callback(err,null);
		else callback(null,blocked.concat(users));
	});
}

// Adds app filters. 
exports.addActivityFilters = function(req, res, next) {
	let user = req.query.user;
	let start = req.query.start;
	let end = req.query.end;
	let type = req.query.activityType;
	let minPrice = req.query.minPrice;
	let maxPrice = req.query.maxPrice;
	let title = req.query.title;

	let filters = req.activityFilters || {};
	if (start) filters['timestampStart'] = { $gte: start };
	if (end) filters['timestampEnd'] = { $lt: end };
	if (type) filters['activityType'] = type;

	let userQuery = {}
	if (user) userQuery.$eq = user._id;

	let priceQuery = {};
	if (minPrice) priceQuery.$gte = parseFloat(minPrice);
	if (maxPrice && maxPrice > 0) priceQuery.$lte = parseFloat(maxPrice);
	if (minPrice || maxPrice) filters['price'] = priceQuery;

	if (title && title.trim()) {
		let titleQuery = {};
		titleQuery.$regex = new RegExp(".*" + title.trim() + ".*","i");
		filters['title'] = titleQuery;
	}

	// we need to query blocked users because blockin is a 2 directional logic
	exports.getBlockedUsers(req.user, function(err, blocked) {
		if (err) return res.send(err);

		userQuery.$nin = blocked;

		filters['user'] = userQuery;

		filters['participants'] = {
			$nin: blocked
		};

		req.activityFilters = filters;
		next();
	});
}

// populates the sort object to the mongo query
exports.addActivitySort = function(req, res, next) {
	let sort = {
		0: {
			createdAt: -1
		},
		1: {
			createdAt: 1
		},
		2: {
			timestampStart: -1
		},
		3: {
			timestampStart: 1
		},
		4: {
			price: -1
		},
		5: {
			price: 1
		},
		6: {
			title: -1
		},
		7: {
			title: 1
		},
	};

	var s;
	// sort is a number from 0 to 7
	if (s = req.query.sort) {
		req.sort = sort[s];
	}

	next();
}

// manipulates activity data on post and put requests from both normal and entity users
exports.setActivityData = function(req, res, next) {
    let activity = {
        title: req.body.title,
        description: req.body.description,
        user: req.user,
        activityType: req.body.activityType,
        price: req.body.price,
        images: req.body.images,
        capacity: req.body.capacity,
        lat: req.body.lat,
        long: req.body.long,
        timestampStart: req.body.timestampStart,
        timestampEnd: req.body.timestampEnd,
        entity: req.entity || undefined,
        createdAt: Date.now()
    };

    /* Activity already exists */
    if (req.activity) {
   		activity.participants = req.activity.participants;
   		activity.user = req.activity.user;
   		activity.createdAt = req.activity.createdAt;
    }

    req.activityData = activity;

    next();

}

// asserts that the created/updated activity is not out of bounds from the entity
exports.checkOutOfBoundsActivity = function(req, res, next) {
	let entity = req.entity;
	let lat = req.body.lat;
	let long = req.body.long;

	let distance = geolib.getDistance(
		{latitude: lat, longitude: long},
		{latitude: entity.place.lat, longitude: entity.place.long}
	);

	if (distance > entity.place.max) {
		return res.status(404).send("Activity out of bounds");
	}

	next();
}
// selects the specific activity routes. It was finally decided that all attributes were allowed 
// to be seen independently from the requester user type
exports.selectActivityAttributes = function(req, res, next) {
	let attributes = req.activityAttributes || {};

	let base = ['completeName','profilePic','username'];

	next();
}

// asserts that the target activity belongs to the same entity as the user
exports.isFromEntity = function(req, res, next) {
	if (req.user.entity.equals(req.activity.entity)) {
		next();
	}
	else return res.status(403).send("not allowed");
}

// asserts that the activity was created by the requester
exports.isFromUser = function(req, res, next) {
	if (req.user.equals(req.activity.user)) {
		next();
	}
	else return res.status(403).send("not allowed");
}

// checks that the user participated in the activity
// they participated if the user is inside the active array AND the activity finished
exports.userParticipated = function(req, res, next) {
	let activity = req.activity;
	let user = req.user;

	if (activity.active.indexOf(user._id) == -1)
		return res.status(432).send("user did not participate");

	let exit = Date.now() < activity.timestampEnd;

	if (exit)
		return res.status(433).send("activity did not finish yet");

	next();
}

// adds pagination to the mongo query
exports.populatePagination = function(req, res, next) {
	let limit = req.query.limit !== undefined ? parseInt(req.query.limit ) : undefined;
	let skip = req.query.skip !== undefined ? parseInt(req.query.skip) : undefined;

	req.pagination = {
		limit: limit,
		skip: skip
	};

	next();
}

// adds a filter which will only return activities created by the requester user
exports.ownActivities = function(req, res, next) {
	req.activityFilters = req.activityFilters || {};
	req.activityFilters.user = req.user._id;
	next();
}

// checks if the user is close to an activity
exports.isActiveUser = function(req, res, next) {
	let user = req.user;

	Activity.find({
		participants: user,
		timestampEnd: {
			$gt: Date.now()
		}
	}, function(err, activities) {
		if (err) return res.send(err);

		if (activities.length == 0) next();
		else {
			// get activities that are close enough
			let selected = activities.filter(activity => {
				return ctrl.isActivityClose(activity,req.body.lat,req.body.long,50);
			});

			// map only selected ids so the update is less heavy
			let ids = selected.map(activity => {
				return activity._id;
			});

			// add the user to the active array of the activities that were close enough
			Activity.updateMany({
				_id: {
					$in: ids
				}
			}, {
				$addToSet: {
					active: user._id
				}
			}, function(err) {
				if (err) return res.send(err);
				else next();
			});
		}
	})
}