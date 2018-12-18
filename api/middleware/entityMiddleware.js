var mongoose = require('mongoose');
Entity = mongoose.model('Entities');


exports.populateEntity = function(req, res, next) {
	let entityId = req.params.entityId;

	if (!entityId) return res.status(400).send("Bad request");

	Entity.findOne({_id: entityId}, function(err, entity) {
		if (err) return res.send(err);
		if (!entity) return res.send(404).send("entity not found");
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
		return res.status(403).send("not allowed to operate this entity");
	}
}

exports.checkEntity = function(req, res, next) {
	exports.allowedUser(req,res, function() {
		exports.populateEntity(req,res,next);
	});
}

exports.getEntity = function(req, res, next) {
	console.log("----- 1 ------");

    Entity.findOne({_id: req.params.entityId}, function(err, entity) {
		if (err) return res.send(err);
		if (!entity) return res.send(404).send("Entity not found");
		req.entity = entity;
		next();
	});
}

exports.getUsers = function(req, res, next) {
	console.log("----- 2 ------");

    User.find({entity: req.entity._id, userType: 'normal'}, function(err, users) {
        if (err) return res.status(404).send("Entity not found");
        else {
        	req.entityUsers = users;
        	next();
        }
    });
}
