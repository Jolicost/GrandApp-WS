var mongoose = require('mongoose');
Achievement = mongoose.model('Achievements');
ctrl = require('../controllers/achievementController');

exports.checkNumberAchievements = function(req, res, next) {
	let user = req.user;

	ctrl.computeAchievements(user, function(err, achievements) {
        if (err) return res.send(err);
        else next();
    }, {number: true});
}

exports.checkCreateAchievements = function(req, res, next) {
    let user = req.user;

	ctrl.computeAchievements(user, function(err, achievements) {
        if (err) return res.send(err);
        else next();
    }, {create: true});   	
}

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

exports.purgeReferences = function(req, res, next) {
	Achievement.find({}).distinct('_id').exec(function(err, achievements) {
		if (err) return res.send(err);

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