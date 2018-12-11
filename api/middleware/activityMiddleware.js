var mongoose = require('mongoose');
Activity = mongoose.model('Activities');


exports.populateActivity = function(req, res, next) {
	let activityId = req.params.activityId;

	if (!activityId) return res.status(400).send("Bad request");

	Activity.findOne({_id: activityId}, function(err, activity) {
		if (err) return res.send(err);
		req.activity = activity;
		next();
	});
}

exports.userInActivity = function(req, res, next) {
	let user = req.user;
	let activity = req.activity;

	Activity.count({
		_id: activity._id,
		participants: {
			$elemMatch:{
				'$eq': user._id
			} 
		}
	}, function(err, n){
		if (err) return res.send(err);
		else if (!n || n == 0) return res.status(400).send("user not in activity");
		else next();
	})
}

exports.userNotInActivity = function(req, res, next) {
	let user = req.user;
	let activity = req.activity;

	Activity.count({
		_id: activity._id,
		participants: {
			$elemMatch:{
				'$eq': user._id
			} 
		}
	}, function(err, n){
		if (err) return res.send(err);
		else if (n > 0) return res.status(400).send("user in activity");
		else next();
	})
}
