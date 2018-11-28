'use strict';
/* Author: Joan Oliva */
var mongoose = require('mongoose'),
    User = mongoose.model('Users'),
    Entity = mongoose.model('Entities'),
    Activity = mongoose.model('Activities');

var config = require('../../config/config.js');
var moment = require('moment'); 
var isodate = require("isodate");
var async = require('async');

function prepareRangedQuery(attribute,start,end) {
	let hasParameters = false;
	let dateRange = {};

	if (start) {
		dateRange['$gte'] = start;
		hasParameters = true;
	}
	if (end) {
		dateRange['$lt'] = end;
		hasParameters = true;
	}

	return {
		valid: hasParameters,
		dateRange: dateRange
	};
}

function findModelByRange(model, attribute, start, end, entityId, callback) {
	
	let query = {
		entity: entityId
	};
	
	var o;
	if ((o = prepareRangedQuery(attribute,start,end)).valid) {
		query[attribute] = o.dateRange;
	}

	model.find(query, function(err, results) {
		if (err) callback(err,null);
		else callback(null,results);
	});
}

function getMean(array, expression) {
	let n = 0;
	let sum = 0;
	array.forEach(element => {
		sum += expression(element);
		n++;
	});

	if (n == 0) return 0;
	else return sum / n;
}

function getMeanUsers(activities) {
	let n = 0;
	let users = 0;
	activities.forEach(activity => {
		users += activity.participants.length;
		n++;
	});

	if (n == 0) return 0;
	else return users / n;
}

function getHourMap() {
	let ret = {};
	for (var i = 0; i < 24; i++) {
		ret[i] = 0;
	}
	return ret;
}


function getActivitiesByHour(activities) {
	let hours = getHourMap();
	activities.forEach(activity => {
		if (activity.timestampStart) {
			hours[moment(activity.timestampStart).hour()]++;
		}
	});
	return hours;
}

function getActivityDuration(activity) {
	let start = activity.timestampStart;
	let end = activity.timestampEnd;

	if (!(start && end)) return 0;

	var duration = moment.duration(moment(end).diff(moment(start)));

	return duration.asSeconds();
}

function getActivitiesMeanDuration(activities) {
	return getMean(activities, function(activity) {
		return getActivityDuration(activity);
	});
}

function getActivitiesByType(activities) {
	let ret = {}
	activities.forEach(activity => {
		if (ret[activity.activityType]) ret[activity.activityType++];
		else ret[activity.activityType] = 1;
	});
	return ret;
}

function getActivitiesParticipants(activities) {
	let participants = new Set();
	activities.forEach(activity => {
		activity.participants.forEach(user => {
			participants.add(user);
		});
	});
	let ret = Array.from(participants);
	return ret;
}

function getUserAges(users, callback) {
	var query = User.find({_id: {$in: users}});

	query.select('birthday');

	query.exec(function(err, birthdays){
		if (err) callback(err,null);
		else callback(null,birthdays.map(birthday => {
			// mapeamos la edad de la persona mediante su fecha de nacimiento
			return moment.duration(moment().diff(moment(birthday.birthday))).asYears();
		}));
	});
}

function getAgesMap() {
	let ret = {};
	for (var i = 0; i < 150; i++) {
		ret[i] = 0;
	}
	return ret;
}

function mapAges(ages) {
	let ret = getAgesMap();
	ages.forEach(age => {
		ret[Math.trunc(age)]++;
	});
	return ret;
}

function getActivitiesUserAges(activities,callback) {
	let participants = getActivitiesParticipants(activities);
	getUserAges(participants, function(err, ages) {
		if (err) callback(err,null);
		else callback(null,mapAges(ages));
	});
}



exports.activities = function(req, res) {
	findModelByRange(Activity,'timestampStart',req.query.start,req.query.end,req.entity._id, function(err, activities) {
		if (err) return res.send(err);

		async.parallel({
			nActivities: function(callback) {
				callback(null,activities.length);
			},
			meanUsers: function(callback) {
				callback(null,getMeanUsers(activities));
			},
			hours: function(callback) {
				callback(null,getActivitiesByHour(activities));
			},
			meanDuration: function(callback) {
				callback(null,getActivitiesMeanDuration(activities));
			},
			types: function(callback) {
				callback(null,getActivitiesByType(activities));
			},
			ages: function(callback) {
				getActivitiesUserAges(activities,callback);
			},
			activities: function(callback) {
				callback(null,activities);
			},
		},
		function(err, results) {
			if (err) return res.send(err);
			return res.json(results);
		});
	});
}

exports.users = function(req, res) {
	findModelByRange(User,'timestampStart',req.query.start,req.query.end,req.entity._id, function(err, activities) {
		if (err) return res.send(err);
		else return res.json(activities);
	});
}
