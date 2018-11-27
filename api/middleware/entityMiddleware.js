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
