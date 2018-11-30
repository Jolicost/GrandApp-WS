var mongoose = require('mongoose');
Entity = mongoose.model('Entities');
var user = require('../controllers/userController');
var access = require('../controllers/access/acl');
var User = require('../models/userModel');

var async = require('async');

exports.userNotExists = function(req, res, next) {
	user.userNotExists(req.body, function(err) {
		if (err) return res.status(406).send(err);
		else next();
	});
}

exports.seeOwn = function(req, res, next) {
	// check if we are getting all users or only one
	console.log(req.query);
	let u = req.params.id;
	if (!u) next();
	else {
		var can;
		if (u == req.userId) {
			can = access.can(req.user.userType).readOwn('user').granted;	
		}
		else {
			can = access.can(req.user.userType).readAny('user').granted;
		}

		if (!can) return res.status(403).send("not allowed to see the user");
		else next();
	}
}

exports.seeAll = function(req, res, next) {
	let u = req.params.id;
	if (u) next();
	else {
		// For now we allow to see every user. We will filter results
		next();
	}
}

exports.filterUser = function(req, res, next) {
	let u = req.params.id;

	if (!u) next();
	else {
		var can;
		if (u == req.userId) {
			can = access.can(req.user.userType).readOwn('user');	
		}
		else {
			can = access.can(req.user.userType).readAny('user');
		}
		var data = Object.create(res['locals']['bundle']);
		console.log(can.attributes);
		console.log(data);
		res.locals.bundle = can.filter({_id:"abc",password:"asf"});
		next();
	}	
}

function bestCopyEver(src) {
	console.log(src);
  return Object.assign({}, src);
}

exports.filterEntity = function(req, res, next) {
	let user = req.user;

	if (user.userType == 'entity') {
		req.query.entity = user.entity;
		req.query.userType = 'normal';
	}
	next();
}

exports.filterRead = function(req, res, next) {
	let user = req.user;
	let target = req.params.userId;

	if (user == target) {
		
	}

	console.log(User.schema.paths);
	next();
}