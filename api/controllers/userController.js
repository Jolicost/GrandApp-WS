'use strict';
/* Author: Joan Oliva
 * Basic API rest for users model */
var mongoose = require('mongoose'),
    // dependencies seprated by commas. Be aware
    User = mongoose.model('Users');

var async = require('async');

exports.list = function(req, res) {
    let filters = req.userFilters || {};
    let attributes = req.userAttributes || {};
    User.find(filters,attributes, function(err, users) {
        if (err)
            res.send(err);
        else
            res.json(users);
    });
};

exports.read = function(req, res) {
    let attributes = req.userAttributes || {};
    User.findById(req.params.userId, attributes, function(err, user) {
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

function computeAddress(address) {
    return {
        placeId: 'fake place id',
        placeName: address
    };
}

exports.updateNormal = function(req, res) {
    User.findByIdAndUpdate(req.params.userId,
    {
        completeName: req.body.completeName,
        email: req.body.email,
        phone: req.body.phone,
        profilePic: req.body.profilePic
    }, function(err, user) {
        if (err)
            res.send(err);
        else
            res.send(200);
    });
};

exports.updateEntity = function(req, res) {
    let password = req.body.password;


    User.findByIdAndUpdate(req.params.userId,
    {
        completeName: req.body.completeName,
        email: req.body.email,
        phone: req.body.phone,
        profilePic: req.body.profilePic,
        birthday: req.body.birthday
    }, function(err, user) {
        if (err)
            res.send(err);
        else
            res.send(200);
    });
};

exports.updateCoords = function(req, res) {
    
    let update = {};
    update['place.lat'] = req.body.lat;
    update['place.long'] = req.body.long;

    if (req.entity) update['entity'] = req.entity.id;

    User.findByIdAndUpdate(req.params.userId, update, function(err, user) {
        if (err) res.send(err);
        else res.json({success:true});
    });
}

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
        return res.status(200).send("Success");
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
        else if (results.userE) finalCallback(null,results.userE);
        else if (results.userU) finalCallback(null,results.userU);
        else if (results.userP) finalCallback(null,results.userP);
        else finalCallback(null);
    });
}