var mongoose = require('mongoose');
Activity = mongoose.model('Activities');

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

		req.entity = choosen.entity || undefined;
		next();
	});

}

exports.addEntityFilters = function(req, res, next) {
	let filters = req.activityFilters || {};

	filters.entity = req.entity._id;

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

	let filters = req.activityFilters || {};
	if (start) filters['timestampStart'] = { $gte: start };
	if (end) filters['timestampEnd'] = { $lt: end };
	if (type) filters['activityType'] = type;

	let userQuery = {}
	if (user) userQuery.$eq = user._id;

	exports.getBlockedUsers(req.user, function(err, blocked) {
		if (err) return res.send(err);

		userQuery.$nin = blocked;

		filters['user'] = userQuery;

		req.activityFilters = filters;
		next();
	});
}

exports.addBlockedFilters = function(req, res, next) {
	let filters = req.activityFilters || {};

	let blocked = req.user.blocked;


}

exports.setActivityData = function(req, res, next) {
	let entity = req.entity || undefined;

    let activity = {
        title: req.body.title,
        description: req.body.description,
        user: req.user,
        participants: [req.user],
        activityType: req.body.activityType,
        price: req.body.price,
        capacity: req.body.capacity,
        lat: req.body.lat,
        long: req.body.long,
        address: req.body.address,
        timestampStart: req.body.timestampStart,
        timestampEnd: req.body.timestampEnd,
        entity: entity
    };

    req.activityData = activity;

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

	if (activity.participants.indexOf(user._id) == -1)
		return res.status(432).send("user did not participate");

	let exit = Date.now() < activity.timestampEnd;

	if (exit)
		return res.status(433).send("activity did not finish yet");

	next();
}

exports.populatePagination = function(req, res, next) {
	let limit = parseInt(req.query.limit) || undefined;
	let skip = parseInt(req.query.skip) || undefined;

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