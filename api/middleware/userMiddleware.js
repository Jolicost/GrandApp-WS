var mongoose = require('mongoose');
Entity = mongoose.model('Entities');
var user = require('../controllers/userController');

var async = require('async');

exports.userNotExists = function(req, res, next) {
	user.userNotExists(req.body, function(err) {
		if (err) return res.status(406).send(err);
		else next();
	});
}