'use strict';

var mongoose = require('mongoose'),
    Activity = mongoose.model('Activities');

exports.list = function(req, res) {
    Activity.find({}, function(err, activities) {
        if (err)
            res.send(err);
        else
            res.json(activities);
    });
};

exports.shortList = function(req, res) {
    //var activities = exports.list(req,res);
    /*ActivityList.find({}, function(err,activities) {
        if (err)
            res.send(err);
        else 
            res.json(activities);*/

    for (var i = 0; i < activities.length - 1; i++) {
        var obj = activities[i].toObject();

        /* 
        _id
        titol
        1era foto
        lat, long
        maxCapacitat
        personesApuntes: size users
        timestampInici
        */

        //Ordenar per timestamp



        delete obj.price;
        activities[i] = obj;
    }
};

exports.read = function(req, res) {
    Activity.findById(req.params.activityId, function(err, activity) {
        if (err)
            res.send(err);
        else
            res.json(activity);
    });
};

exports.create = function(req, res) {
    var new_activity = new Activity(req.body);
    new_activity.user = req.userId;
    
    new_activity.save(function(err, activity) {
        if (err)
            res.send(err);
        else
            res.json(activity);
    });
};

exports.createNormal = function(req, res) {
    let entity = req.entity || undefined;

    let activity = new Activity({
        title: req.body.title,
        description: req.body.description,
        user: req.user,
        participants: [req.user],
        activityType: req.body.activityType,
        price: req.body.price,
        capacity: req.body.capacity,
        lat: req.body.lat,
        long: req.body.long,
        address: req.body.address,
        timestampStart: req.body.timestampStart,
        timestampEnd: req.body.timestampEnd,
        entity: entity
    });
    
    activity.save(function(err, activity) {
        if (err) res.send(err);
        else res.status(200).send("Activity created");
    });
}

exports.update = function(req, res) {
    Activity.findOneAndUpdate({
        _id: req.params.activityId
    }, req.body, {
        new: true
    }, function(err, activity) {
        if (err)
            res.send(err);
        else
            res.json(activity);
    });
};

exports.delete = function(req, res) {
    Activity.remove({
        _id: req.params.activityId
    }, function(err, activity) {
        if (err)
            res.send(err);
        else
            res.json({
                message: 'Activity deleted'
            });
    });
};

exports.deleteAll = function(req, res) {
    Activity.deleteMany({}, function(err, activity) {
        if (err)
            res.send(err);
        else
            res.json({
                message: 'All activities deleted'
            });
    });
};


exports.join = function(req, res) {
    Activity.findOneAndUpdate({_id: req.activity._id},
    {   
        $push: {participants: req.user._id}
    }, function(err) {
        if (err) return res.status(500).send("internal server error");
        else return res.status(200).send("Joined to activity");
    });
}

exports.leave = function(req, res) {
    Activity.findOneAndUpdate({_id: req.activity._id},
    {   
        $pullAll: {participants: [req.user._id] } 
    }, function(err) {
        if (err) return res.status(500).send("internal server error");
        else return res.status(200).send("Activity left");
    });
}