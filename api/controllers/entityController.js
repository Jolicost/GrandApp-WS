'use strict';
/* Author: Joan Oliva
 * Basic API rest for entities model */
var mongoose = require('mongoose'),
    // dependencies seprated by commas. Be aware
    Entity = mongoose.model('Entities');

var geolib = require('geolib');

exports.list = function(req, res) {
    Entity.find({}, function(err, entities) {
        if (err)
            res.send(err);
        else
            res.json(entities);
    });
};

exports.read = function(req, res) {
    Entity.findById(req.params.entityId, function(err, entity) {
        if (err)
            res.send(err);
        else
            res.json(entity);
    });
};

exports.create = function(req, res) {
    var new_Entity = new Entity(req.body);
    new_Entity.save(function(err, entity) {
        if (err)
            res.send(err);
        else
            res.json(entity);
    });
};

exports.update = function(req, res) {
    Entity.findOneAndUpdate({
        _id: req.params.entityId
    }, req.body, {
        new: true
    }, function(err, entity) {
        if (err)
            res.send(err);
        else
            res.json(entity);
    });
};

exports.delete = function(req, res) {
    Entity.remove({
        _id: req.params.entityId
    }, function(err, entity) {
        if (err)
            res.send(err);
        else
            res.json({
                message: 'Entity deleted'
            });
    });
};

exports.deleteAll = function(req, res) {
    Entity.deleteMany({}, function(err, entity) {
        if (err)
            res.send(err);
        else
            res.json({
                message: 'All entities deleted'
            });
    });
};


exports.getUsers = function(req, res) {
    User.find({entity: req.params.entityId, userType: 'normal'}, function(err, users) {
        if (err) return res.send(err);
        else return res.json(users.map(function(user) {
            return user._id;
        }));
    });
}

exports.getActivities = function(req, res) {
    Activity.find({entity: req.params.entityId}, function(err, activities) {
        if (err) return res.send(err);
        else return res.json(activities.map(function(activities) {
            return activities._id;
        }));
    });
}

exports.getUsersNotInRange = function(req, res, next) {
    console.log("----- 3 ------");

    let entity = req.entity;

    let lat = entity.place.lat;
    let long = entity.place.long;

    let usersNiR = req.entityUsers;

    let ret = [];

    usersNiR.forEach(user => {
        console.log("----- 4 ------");

        let distance = geolib.getDistance(
            {latitude: lat, longitude: long},
            {latitude: user.place.lat, longitude: user.place.long}
        );

        if (distance > entity.place.max) {
            ret.push(user);
        } else {

        }
    })

    console.log("----- 5 ------");
    
    return res.json(ret);
}