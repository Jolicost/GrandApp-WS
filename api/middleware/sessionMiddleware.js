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
        next();
    });
}