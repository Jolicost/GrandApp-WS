'use strict';
/* Author: Joan Oliva
 * Basic API rest for users model */
var mongoose = require('mongoose'),
    // dependencies seprated by commas. Be aware
    User = mongoose.model('Users');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../../config/config.js');

function hashPassword(password)
{
    return bcrypt.hashSync(password, 8);
}
exports.login = function(req, res) {
    let password = req.body.password;
    let phone = req.body.phone;
    let username = req.body.username;

    if (phone && username) return res.status(434).send("specified both user and phone");
    if (!password) return res.status(435).send("did not specify password");

    if (!phone && !username) return res.status(436).send("need to specify more information");

    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    User.findOne({
        $or: [
            {
                username: username
            },
            {
                phone: phone
            }
        ]
    }, function(err, user) {
        if (!user) return res.status(432).send("Invalid user");
        bcrypt.compare(req.body.password, user.password, function(err, result) {
            if (err) return res.status(500).send("Login failed");
            if (!result) return res.status(433).send("Invalid password");

            var token = jwt.sign({
                id: user._id
            }, config.get('server.auth.secret'), {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({
                auth: true,
                token: token,
                user: user
            });
        });
    });
};

exports.logout = function(req, res) {
    // not really doing anything do ya
    res.status(400).send("You are not supposed to enter this hole");
};

exports.register = function(req, res) {

    if (!req.body.password) return res.status(434).send("Password not specified");
    //if (!req.body.username) return res.status(435).send("Username not specified");
    if (!req.body.email) return res.status(436).send("Email not specified");
    if (!req.body.phone) return res.status(435).send("Phone not specified");

    var hashedPassword = bcrypt.hashSync(req.body.password, 8);

    let user = new User({
        //username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        completeName: req.body.completeName,
        birthday: req.body.birthday,
        phone: req.body.phone
    });

    user.save(function(err, user) {
        if (err) return res.status(500).send("Unable to register user");
        // create a token
        var token = jwt.sign({
            id: user._id
        }, config.get('server.auth.secret'), {
            expiresIn: 86400 // expires in 24 hours
        });

        res.status(200).send({
            auth: true,
            token: token,
            user: user
        });
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
        return res.status(403).send("invalid request: some password not spcified");
    
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
    return res.status(200).send("forgot password");
}
