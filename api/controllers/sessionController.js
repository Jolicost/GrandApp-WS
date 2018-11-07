'use strict';
/* Author: Joan Oliva
* Basic API rest for users model */
var mongoose = require('mongoose'),
// dependencies seprated by commas. Be aware
User = mongoose.model('Users');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../../config/config.js');

exports.login = function(req,res) {
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    User.findOne({
        username: req.body.username,
    }, function(err, user) {
        if (!user) return res.status(400).send("Invalid username");
        bcrypt.compare(req.body.password, user.password, function(err, result) {
            if (err) return res.status(500).send("Login failed");
            if (!result) return res.status(400).send("Invalid password");

            var token = jwt.sign({ id: user._id }, config.get('server.auth.secret'), {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token });
        }); 
    });
};

exports.logout = function(req,res) {
    // not really doing anything do ya
    res.status(400).send("You are not supposed to enter this hole");
};

exports.register = function(req,res) {
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);

    let user = new User({
        username : req.body.username,
        email : req.body.email,
        password : hashedPassword
    });

    user.save(function(err, user) {
        if (err) return res.status(500).send("Unable to register user");
        // create a token
        var token = jwt.sign({ id: user._id }, config.get('server.auth.secret'), {
          expiresIn: 86400 // expires in 24 hours
        });

        res.status(200).send({ auth: true, token: token });
    });


};

exports.testAuthorization = function(req, res) {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, config.get('server.auth.secret'), function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    
        User.findById(decoded.id, function (err, user) {
          if (err) return res.status(500).send("There was a problem finding the user.");
          if (!user) return res.status(404).send("No user found.");
          
          res.status(200).send(user);
        });
    });
};