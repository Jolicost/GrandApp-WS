var mongoose = require('mongoose');
Entity = mongoose.model('Entities');


exports.populateEntity = function(req, res, next) {
	let entityId = req.params.entityId;

	if (!entityId) return res.status(400).send("Bad request");

	Entity.findOne({_id: entityId}, function(err, entity) {
		if (err) return res.send(err);
		req.entity = entity;
		next();
	});
}

exports.setEntity = function(req, res, next) {
	Entity.findOne({_id: req.user.entity}, function(err, entity) {
		if (err) return res.send(err);
		req.entity = entity;
		next();
	})
}

exports.allowedUser = function(req, res, next) {
	let entityId = req.params.entityId;

	if (req.user.entity._id == entityId) {
		next();
	}
	else {
		return req.status(403).send("not allowed to operate this entity");
	}
}

exports.checkEntity = function(req, res, next) {
	exports.allowedUser(req,res, function() {
		exports.populateEntity(req,res,next);
	});
}
