'use strict';
/* Author: Joan Oliva */
var mongoose = require('mongoose'),
    User = mongoose.model('Users'),
    Entity = mongoose.model('Entities'),
    Activity = mongoose.model('Activities');

var config = require('../../config/config.js');
var moment = require('moment');
var isodate = require("isodate");

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

exports.activities = function(req, res) {

	findModelByRange(Activity,'timestampStart',req.query.start,req.query.end,req.entity._id, function(err, activities) {
		if (err) return res.send(err);
		else return res.json(activities);
	});
	
}

exports.users = function(req, res) {
	findModelByRange(User,'timestampStart',req.query.start,req.query.end,req.entity._id, function(err, activities) {
		if (err) return res.send(err);
		else return res.json(activities);
	});
}
