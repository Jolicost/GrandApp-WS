var mongoose = require('mongoose');
Entity = mongoose.model('Entities');
var user = require('../controllers/userController');

var async = require('async');

exports.userNotExists = function(req, res, next) {
	user.userNotExists(req.body, function(err, user) {
		if (err) return res.status(500).send();
		if (user) return res.status(406).send("user exists");
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