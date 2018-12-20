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
	let filters = req.userFilters || {};
	let attributes = req.userAttributes || {};
    User.find(filters, attributes, function(err, users) {
        if (err) return res.send(err);
        else {
        	req.entityUsers = users;
        	next();
        }
    });
}


exports.purgeReferences = function(req, res, next) {
    Entity.find({}).distinct('_id').exec(function(err, entities) {
        if (err) return res.send(err);
        
        Activity.updateMany({
            entity: {
                $nin: entities
            }
        }, {
            $unset: {
            	entity: 1
            }
        }).exec();

        User.updateMany({
        	userType: 'normal',
            entity: {
                $nin: entities
            }
        }, {
            $unset: {
            	entity: 1
            }
        }).exec();


        User.deleteMany({
        	userType: 'entity',
            entity: {
                $nin: entities
            }
        }).exec();

        next();
    });
}