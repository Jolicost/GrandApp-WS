var jwt = require('jsonwebtoken');
var config = require('../../config/config');
var mongoose = require('mongoose');

User = mongoose.model('Users');
var async = require("async");
/* Function to verify that a token exists 
 * You must call this middleware function in every API request in order to authorize the user
 * POSTCONDITION: req.userId will be set to the requester user id. 
 * You can obtain the information about the requester user using such attribute on latter middleware/functions
  */
exports.verifyToken = function(req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token)
        return res.status(401).send({
            auth: false,
            message: 'No token provided.'
        });

    jwt.verify(token,config.get('server.auth.secret'), function(err, decoded) {
        if (err)
            return res.status(500).send({
                auth: false,
                message: 'Failed to authenticate token'
            });

        // if everything good, save to request for use in other routes
        req.userId = decoded.id;

        // Save user last request
        User.updateOne({_id: decoded.id}, {
            lastRequest: Date.now(),
            $inc: {
                nRequests: 1
            }
        }, function(err) {
            if (err) console.log("Failed to update last request for user: " + decoded.id);
        });
        
        next();
    });
}

exports.obtainUser = function(req, res, next) {
    // Obtain user id via previous middleware
    var userId = req.userId;

    User.findById(userId, function(err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        // Send the correct user
        req.user = user;
        next();
    });
}

exports.verifyAndObtain = function(req, res, next) {
    exports.verifyToken(req, res, function() {
        exports.obtainUser(req, res, function() {
            next();
        });
    });
}

exports.isEntity = function(req, res, next) {
    if (req.user.userType != 'entity')
        return res.status(403).send("Not allowed to access this route");
    else
        next();

}

exports.isAdmin = function(req, res, next) {
    if (req.user.userType != 'admin')
        return res.status(403).send("Not allowed to access this route");
    else
        next();
}
