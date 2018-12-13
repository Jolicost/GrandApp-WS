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
		else if (!n || n == 0) return res.status(400).send("user not in activity");
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
		else if (n > 0) return res.status(400).send("user in activity");
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

		req.entity = choosen.entity;
		next();
	});

}

exports.addEntityFilters = function(req, res, next) {
	let filters = req.activityFilters || {};

	filters.entity = req.entity._id;

	req.activityFilters = filters;

	next();
}

exports.addActivityFilters = function(req, res, next) {
	let user = req.query.user;
	let start = req.query.start;
	let type = req.query.activityType;
	let own = req.query.own;
	
	let filters = req.activityFilters || {};
	if (own) filters['user'] = req.user._id;
	else if (user) filters['user'] = user;

	if (start) filters['timestampStart'] = { $gte: start };
	if (type) filters['activityType'] = type;
	req.activityFilters = filters;
	next();
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