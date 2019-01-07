var mongoose = require('mongoose');
Activity = mongoose.model('Activities');
var ctrl = require('../controllers/activityController');

var geolib = require("geolib");

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

exports.getActivityUser = function(req, res, next) {
	let user = req.user;
	req.body.user = user._id;
	next();
}

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

exports.getBlockedUsers = function(user,callback) {
	let blocked = user.blocked;

	User.find({blocked: user._id}).distinct('_id').exec(function(err, users) {
		if (err) callback(err,null);
		else callback(null,blocked.concat(users));
	});
}

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
	if (s = req.query.sort) {
		req.sort = sort[s];
	}

	next();
}

exports.addBlockedFilters = function(req, res, next) {
	let filters = req.activityFilters || {};

	let blocked = req.user.blocked;


}

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
exports.selectActivityAttributes = function(req, res, next) {
	let attributes = req.activityAttributes || {};

	let base = ['completeName','profilePic','username'];

	next();
}

exports.isFromEntity = function(req, res, next) {
	if (req.user.entity.equals(req.activity.entity)) {
		next();
	}
	else return res.status(403).send("not allowed");
}

exports.isFromUser = function(req, res, next) {
	if (req.user.equals(req.activity.user)) {
		next();
	}
	else return res.status(403).send("not allowed");
}

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

exports.populatePagination = function(req, res, next) {
	let limit = req.query.limit !== undefined ? parseInt(req.query.limit ) : undefined;
	let skip = req.query.skip !== undefined ? parseInt(req.query.skip) : undefined;

	req.pagination = {
		limit: limit,
		skip: skip
	};

	next();
}

exports.ownActivities = function(req, res, next) {
	req.activityFilters = req.activityFilters || {};
	req.activityFilters.user = req.user._id;
	next();
}

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
			let selected = activities.filter(activity => {
				return ctrl.isActivityClose(activity,req.body.lat,req.body.long,50);
			});

			let ids = selected.map(activity => {
				return activity._id;
			});

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