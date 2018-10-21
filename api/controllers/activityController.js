'use strict';

var mongoose = require('mongoose'),
	Activity = mongoose.model('Activities');

exports.list = function(req,res) {
	Activity.find({}, function(err,activities) {
		if (err)
			res.send(err);
		else
			res.json(activities);
	});
};

exports.read = function(req,res) {
	Activity.findById(req.params.activityId, function(err,activity) {
		if (err)
			res.send(err);
		else
			res.json(activity);
	});
};

exports.create = function(req,res) {
	var new_activity = new Activity(req.body);
	new_activity.save(function(err,activity) {
		if (err)
			res.send(err);
		else
			res.json(activity);
	});
};

exports.update = function(req,res) {
	Activity.findOneAndUpdate({_id: req.params.activityId}, req.body, {new: true}, function(err,activity){
		if (err)
			res.send(err);
		else
			res.json(activity);
	});
};

exports.delete = function(req, res) {
	Activity.remove({
		_id: req.params.activityId
	}, function(err, activity){
		if (err)
			res.send(err);
		else
			res.json({message: 'Activity deleted'});
	});
};

exports.deleteAll = function(req, res) {
	Activity.remove({} , function(err, activity) {
		if (err)
			res.send(err);
		else
			res.json({message: 'All activities deleted'});
	});
};