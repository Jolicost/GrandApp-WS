var mongoose = require('mongoose');
Achievement = mongoose.model('Achievements');
ctrl = require('../controllers/achievementController');

// checks and updates the number type achievements from the user
exports.checkNumberAchievements = function(req, res, next) {
	let user = req.user;

	ctrl.computeAchievements(user, function(err, achievements) {
        if (err) return res.send(err);
        else next();
    }, {number: true});
}

// checks and updates the create type achievements from the user
exports.checkCreateAchievements = function(req, res, next) {
    let user = req.user;

	ctrl.computeAchievements(user, function(err, achievements) {
        if (err) return res.send(err);
        else next();
    }, {create: true});   	
}

// checks and updates the popular type achievements from the user
exports.checkPopularAchievements = function(req, res, next) {
	let creator = req.activity.user;

	User.findOne({_id: creator}, function(err, user) {
		if (err) return res.send(err);
		ctrl.computeAchievements(user, function(err, achievements) {
	        if (err) return res.send(err);
	        else next();
    	}, {popular: true});	
	});
}

// purges references to the deleted achievement
exports.purgeReferences = function(req, res, next) {
	Achievement.find({}).distinct('_id').exec(function(err, achievements) {
		if (err) return res.send(err);

		// pull hard enough
		User.updateMany({

		}, {
			$pull: {
				achievements: {
					$nin: achievements
				}
			}
		}).exec();

		next();
	});
}