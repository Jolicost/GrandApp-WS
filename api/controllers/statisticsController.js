'use strict';
/* Author: Joan Oliva */
var mongoose = require('mongoose'),
    User = mongoose.model('Users'),
    Entity = mongoose.model('Entities'),
    Activity = mongoose.model('Activities');

var config = require('../../config/config.js');


exports.activities = function(req, res) {
	return res.status(200).send(req.entity);
}

exports.users = function(req, res) {
	return res.status(200).send(req.entity);
}
