'use strict';
/* Author: Joan Oliva
 * Basic API rest for users model */
var mongoose = require('mongoose'),
    // dependencies seprated by commas. Be aware
    User = mongoose.model('Users');

var async = require('async');

exports.list = function(req, res) {
    User.find({}, function(err, users) {
        if (err)
            res.send(err);
        else
            res.json(users);
    });
};

exports.read = function(req, res) {
    User.findById(req.params.userId, function(err, user) {
        if (err)
            res.send(err);
        else
            res.json(user);
    });
};

exports.create = function(req, res) {
    var new_User = new User(req.body);
    new_User.save(function(err, user) {
        if (err)
            res.send(err);
        else
            res.json(user);
    });
};

exports.update = function(req, res) {
    User.findOneAndUpdate({
        _id: req.params.userId
    }, req.body, {
        new: true
    }, function(err, user) {
        if (err)
            res.send(err);
        else
            res.json(user);
    });
};

exports.delete = function(req, res) {
    User.remove({
        _id: req.params.userId
    }, function(err, user) {
        if (err)
            res.send(err);
        else
            res.json({
                message: 'User deleted'
            });
    });
};

exports.deleteAll = function(req, res) {
    User.deleteMany({}, function(err, user) {
        if (err)
            res.send(err);
        else
            res.json({
                message: 'All users deleted'
            });
    });
};

exports.getEmergencyPhones = function(req, res) {
    User.findOne({_id: req.params.userId}, function(err, user) {
        if (err) return res.send(err);
        else if (!user) return res.status(404).send('User not found');
        return res.json(user.contactPhones);
    });
}

exports.setEmergencyPhones = function(req, res) {
    User.findOneAndUpdate({_id: req.params.userId}, {contactPhones: req.body}, function(err, user) {
        if (err) return res.send(err);
        if (!user) return res.status(404).send("User not found");
        return res.json(user);
    });
}

exports.userNotExists = function(object, finalCallback) {
    let email = object.email;
    let username = object.username;
    let phone = object.phone;

    async.parallel({
        userE: function(callback) {
            if (!email) callback(null,null);
            else
                User.findOne({email: email}, function(err, user){
                    if (err) callback(err,null);
                    else if (user) callback(null,user);
                    else callback(null,null);
                });
        },
        userU: function(callback) {
            if (!username) callback(null,null);
            else
                User.findOne({username: username}, function(err, user){
                    if (err) callback(err,null);
                    else if (user) callback(null,user);
                    else callback(null,null);
                });
        },
        userP: function(callback) {
            if (!phone) callback(null,null);
            else
                User.findOne({phone: phone}, function(err, user){
                    if (err) callback(err,null);
                    else if (user) callback(null,user);
                    else callback(null,null);
                });
        }
    }, function(err, results) {
        if (err) finalCallback(err);
        else if (results.userE) finalCallback("Provided email belongs to another user");
        else if (results.userU) finalCallback("provided username belongs to another user");
        else if (results.userP) finalCallback("provided phone belongs to another user");
        else finalCallback(null);
    });
}