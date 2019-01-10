'use strict';
/* Author: Joan Oliva */
var mongoose = require('mongoose'),
    User = mongoose.model('Users'),
    Entity = mongoose.model('Entities'),
    Activity = mongoose.model('Activities');
    Achievement = mongoose.model('Achievements');

var config = require('../../config/config.js');
var moment = require('moment'); 
var isodate = require("isodate");
var async = require('async');

// sets mongo filters to the specified dates (start,end) 
// if dates are not specified, -infinite for start and infinite for end are used
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

// finds a model based on an date attribute plus a ranged query (start,end)
function findModelByRangeQueried(model, attribute, start, end, query, callback) {
	var o;
	if ((o = prepareRangedQuery(attribute,start,end)).valid) {
		query[attribute] = o.dateRange;
	}

	model.find(query, function(err, results) {
		if (err) callback(err,null);
		else callback(null,results);
	});
}

// bridge function
function findModelByRange(model, attribute, start, end, entityId, callback) {
	findModelByRangeQueried(model, attribute, start, end, {entity: entityId}, callback);
}

// computes mean based on an expression
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

// returns the mean participants of an activity 
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

// inicializes an hour map for aggregation purposes
function getHourMap() {
	let ret = {};
	for (var i = 0; i < 24; i++) {
		ret[i] = 0;
	}
	return ret;
}


// returns the map from hours to the number of activities of that hour
function getActivitiesByHour(activities) {
	let hours = getHourMap();
	activities.forEach(activity => {
		if (activity.timestampStart) {
			hours[moment(activity.timestampStart).hour()]++;
		}
	});
	return hours;
}

// gets the activity duration
function getActivityDuration(activity) {
	let start = activity.timestampStart;
	let end = activity.timestampEnd;

	if (!(start && end)) return 0;

	var duration = moment.duration(moment(end).diff(moment(start)));

	return duration.asSeconds();
}

// returns the mean duration of the whole set of activities
function getActivitiesMeanDuration(activities) {
	return getMean(activities, function(activity) {
		return getActivityDuration(activity);
	});
}

// returns map from activity type to the number of activities of that type given an array
function getActivitiesByType(activities) {
	let ret = {}
	activities.forEach(activity => {
		if (ret[activity.activityType]) ret[activity.activityType]++;
		else ret[activity.activityType] = 1;
	});
	return ret;
}

// gets the participants from an activity
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

// returns all user ages in an array
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

// inicializes a map from ages (0 to 150) to 0
function getAgesMap() {
	let ret = {};
	for (var i = 0; i < 150; i++) {
		ret[i] = 0;
	}
	return ret;
}

// maps an ages array from the age number to the number of occurences
function mapAges(ages) {
	let ret = getAgesMap();
	ages.forEach(age => {
		ret[Math.trunc(age)]++;
	});
	return ret;
}

// returns the user age
function getUserAge(user) {
	let ret = Math.trunc(moment.duration(moment().diff(moment(user.birthday || 0))).asYears());
	return ret;
}

// returns a map from user ages to a custom function that reduces users to smth
function getAgesMapUsers(users, red) {
	let map = getAgesMap();
	users.forEach(user => {
		map[getUserAge(user)] += red(user);
	});
	return map;
}

// gets the user ages from the whole activities participants union set
function getActivitiesUserAges(activities,callback) {
	let participants = getActivitiesParticipants(activities);
	getUserAges(participants, function(err, ages) {
		if (err) callback(err,null);
		else callback(null,mapAges(ages));
	});
}

// gets the active users from a range (start,end) 
function getActiveUsersByRange(start, end, entityId, callback) {
	let query = {
		entity: entityId,
		userType: 'normal'
	};
	findModelByRangeQueried(User,'lastRequest',start,end, query, function(err, users){
		if (err) callback(err,null);
		else callback(null,users);
	});
}

// gets the total of users of an entity (only normal)
function getTotalEntityUsers(entityId, callback) {
	User.countDocuments({entity: entityId, userType: 'normal'}, function(err, n) {
		if (err) callback(err,null);
		else callback(null,n);
	})
}

// gets the number of registered users given a range
function getRegisteredUsersByRange(start, end, entityId, callback) {
	let query = {
		entity: entityId,
		userType: 'normal'
	};
	findModelByRangeQueried(User,'createdAt',start,end, query, function(err, users){
		if (err) callback(err,null);
		else callback(null,users);
	});
}

// gets an array of usre ages from an user list
function getUserAgesDirect(users) {
	let ages = []
	users.forEach(user => {
		ages.push(moment.duration(moment().diff(moment(user.birthday))).asYears());
	});
	return mapAges(ages);
}


// activity statistics
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
			/*activities: function(callback) {
				callback(null,activities);
			},*/
		},
		function(err, results) {
			if (err) return res.send(err);
			return res.json(results);
		});
	});
}


// user statistics
exports.users = function(req, res) {
	let start = req.query.start;
	let end = req.query.end;
	let entityId = req.params.entityId;



	async.parallel({
		activeUsers: function(callback) {
			getActiveUsersByRange(start,end,entityId, function(err, users){
				if (err) callback(err, null);
				else callback(null, users);
			});
		},
		registeredUsers: function(callback) {
			getRegisteredUsersByRange(start, end, entityId, function(err, users) {
				if (err) callback(err, null);
				else callback(null, users);
			});
		},
		nUsers: function(callback) {
			getTotalEntityUsers(entityId, function(err, count) {
				if (err) callback(err, null);
				else callback(null, count);
			});
		}
	}, function(err, results){
		if (err) return res.send(err);
		else return res.json({
			nRegisteredUsers: results.registeredUsers.length,
			registeredUsersAges: getUserAgesDirect(results.registeredUsers),
			totalUsers: results.nUsers,
			nActiveUsers: results.activeUsers.length,
			activeUsersAges: getUserAgesDirect(results.activeUsers)
		});
	});
}

// sums the number of total connections from the given users
function reduceConnections(users) {
	let n = 0;
	users.forEach(user => {
		n += user.nRequests
	});
	return n;
}

// connection statistics
exports.connections = function(req, res) {
	let start = req.query.start;
	let end = req.query.end;
	let entityId = req.params.entityId;

	async.parallel({
		nConnections: function(callback) {
			getActiveUsersByRange(start,end,entityId, function(err, users){
				if (err) callback(err, null);
				else callback(null, users);
			});
		},
	}, function(err, results){
		if (err) return res.send(err);
		else return res.json({
			nConnections: reduceConnections(results.nConnections)
		});
	});
}

// counts the total number of achievements from a given list of users
function countAchievements(users) {
	let i = 0;
	users.forEach(user => {
		i+= user.achievements.length;
	});
	return i;
}

// maps users age into the total number of acheivements obtained
function mapAchievementsAge(users) {
	return getAgesMapUsers(users, function(user) {
		return user.achievements.length;
	});
}

// maps acheivement types into an array of id's
function mapAchievementsType(ids, achievements) {
	let ret = {}
	achievements.forEach(achievement => {
		let t = achievement.achievementType;
		ret[t] = ret[t] || 0;
		ret[t] += ids.filter(function(id) {
			return achievement._id.equals(id);
		}).length;
	});
	return ret;
}

// maps achievement names into an array of id's
function mapAchievementsName(ids, achievements) {
	let ret = {}
	achievements.forEach(achievement => {
		let t = achievement.title;
		ret[t] = ids.filter(function(id) {
			return achievement._id.equals(id);
		}).length;
	});
	return ret;
}
// gets a whole achievement list from the users
function getWholeAchievements(users) {
	let ret = [];
	users.forEach(user => {
		ret = ret.concat(user.achievements);
	});
	return ret;
}
// achievement statistics
exports.achievements = function(req, res) {
	let start = req.query.start;
	let end = req.query.end;
	let entityId = req.params.entityId;

	async.parallel({
		activeUsers: function(callback) {
			getActiveUsersByRange(start,end,entityId, function(err, users){
				if (err) callback(err, null);
				else callback(null, users);
			});
		},
		achievements: function(callback) {
			Achievement.find({}, function(err, achievements) {
				if (err) callback(err, null);
				else callback(null, achievements);
			});
		}
	}, function(err, results){
		if (err) return res.send(err);
		else return res.json({
			nAchievements: countAchievements(results.activeUsers),
			achievementsPerAge: mapAchievementsAge(results.activeUsers),
			achievementsPerType: mapAchievementsType(
				getWholeAchievements(results.activeUsers),
				results.achievements
			),
			achievementsPerName: mapAchievementsName(
				getWholeAchievements(results.activeUsers),
				results.achievements
			)
		});
	});
}