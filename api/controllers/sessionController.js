'use strict';
/* Author: Joan Oliva
 * Basic API rest for users model */
var mongoose = require('mongoose'),
    // dependencies seprated by commas. Be aware
    User = mongoose.model('Users');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../../config/config.js');
var mail = require('./util/mailSender.js');
var async = require('async');
var userController = require('./userController');

function hashPassword(password)
{
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10));
}
exports.login = function(req, res) {
    let password = req.body.password;
    let phone = req.body.phone;
    let username = req.body.username;

    if (phone && username) return res.status(434).send("specified both user and phone");
    if (!password) return res.status(435).send("did not specify password");

    if (!phone && !username) return res.status(436).send("need to specify more information");

    User.findOne({
        $or: [
            {
                username: username
            },
            {
                phone: phone
            }
        ]
    })
    .select('+password')
    .exec(function(err, user) {
        if (!user) return res.status(432).send("Invalid user");
        signAndSend(req, res, user);
        /*
        bcrypt.compare(req.body.password, user.password, function(err, result) {
            if (err) return res.status(500).send("Login failed");
            if (!result) return res.status(433).send("Invalid password");

            signAndSend(req, res, user);
        });
        */
    });
};

exports.logout = function(req, res) {
    // not really doing anything do ya
    res.status(400).send("You are not supposed to enter this hole");
};

exports.register = function(req, res) {
    var hashedPassword = hashPassword(req.body.password);

    let user = new User({
        //username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        completeName: req.body.completeName,
        birthday: req.body.birthday,
        phone: req.body.phone,
        profilePic: req.body.profilePic
    });

    user.save(function(err, user) {
        if (err) return res.status(500).send(err);
        // create a token
        signAndSend(req, res, user);
    });


};

exports.testAuthorization = function(req, res) {
    return res.status(200).send(req.user);
};

exports.changePassword = function(req, res) {
    // from middleware
    let user = req.user;
    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;

    if (!oldPassword || !newPassword) 
        return res.status(400).send("invalid request: some password not spcified");
    
    bcrypt.compare(oldPassword, user.password, function(err, result) {
        if (!result) return res.status(432).send("old password does not match");
        User.updateOne(
            {_id: user._id}, 
            {password: hashPassword(newPassword)},
            function(err, user) {
                if (err) return res.status(500).send();

                res.status(200).send("password changed");
            }
        );
    });
    
}

exports.forgotPassword = function(req, res) {
    let username = req.body.username;
    let phone = req.body.phone;

    if (username && phone) 
        return res.status(432).send("both username and phone specified");
    if (!username && !phone) 
        return res.status(403).send("invalid request at least username or phone are required");

    User.findOne({
        $or: [
            {username: username},
            {phone: phone}
        ]
    }, function(err, user) {
        if (err) return res.status(500).send("Internal server error");
        if (!user) return res.status(404).send("User not found");

        let r = Math.random().toString(36).substring(8);

        let email = user.email;
        let password = hashPassword(r);

        User.updateOne({_id: user._id}, {password: password}, function(err) {
            mail.sendForgotPassword(user.email,r, function(err) {
                if (err) return res.status(500).send(err);

                return res.status(200).send("Password reset");
            });
        });
    });
}

function signToken(user) {
    var token = jwt.sign({
        id: user._id
    }, config.get('server.auth.secret'), {
        expiresIn: 86400 // expires in 24 hours
    });
    return token;
}

function signAndSend(req, res, user) {
    let jwt = signToken(user);
    res.status(200).send({
        auth: true,
        token: jwt,
        user: user
    });   
}


function registerExternalUser(body, method, callback)
{
    let username = body.username;
    let token = body.token;
    let email = body.email;
    let phone = body.phone;

    let params = {
        username: username,
        email: email,
        phone: phone
    };

    let key = 'auth.' + method + '.token';
    params[key] = token;

    let user = new User(params);

    user.save(function(err, user) {
        if (err) callback(err,null);
        else callback(null,user);
    });
}

function checkLogin(req, res, method) {
    let query = {};
    let key = 'auth.' + method + '.token';
    query[key] = req.body.token;

    User.findOne(query, function(err, user) {
        if (!user) {
            userController.userNotExists(req.body, function(err) {
                if (err) return res.status(407).send(err);
                else {
                    registerExternalUser(req.body,method, function(err, user) {
                        signAndSend(req, res, user); 
                    });
                }
            });
        } else {
            signAndSend(req, res, user)
        }
    });
}


exports.googleLogin = function(req, res) {
    checkLogin(req,res,'google');   
}

exports.facebookLogin = function(req, res) {
    checkLogin(req,res,'facebook');
}
