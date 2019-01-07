var jwt = require('jsonwebtoken');
var config = require('../../config/config');
var mongoose = require('mongoose');

Activity = mongoose.model('Activities');
var async = require("async");

exports.obtainActivit = function(req, res, next) {
    // Obtain activity id via previous middleware
    var activityId = req.roomId;

    Activity.findById(activityId, function(err, user) {
        if (err) return res.status(403).send("There was a problem finding the activity.");
        if (!activity) return res.status(404).send("No activity found.");
        // Send the correct user
        req.activity = activity;
        next();
    });
}