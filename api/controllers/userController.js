'use strict';
/* Basic API rest for users model */
var mongoose = require('mongoose'),
    // dependencies seprated by commas. Be aware
    User = mongoose.model('Users');

// async lib
var async = require('async');

// count the number of documents
exports.count = function(req, res) {
    User.countDocuments(req.userFilters || {}).exec(function(err, n){
        if (err) return res.send(err);
        else return res.json({count: n});
    });
}

// list users
exports.list = function(req, res) {
    // filters, selected attributes, skip and limit come from middleware
    let filters = req.userFilters || {};
    let attributes = req.userAttributes || {};
    User.find(filters,attributes)
    .skip(req.pagination.skip)
    .limit(req.pagination.limit)
    .exec(function(err, users) {
        if (err)
            res.send(err);
        else
            res.json(users);
    });
};

// reads an user
exports.read = function(req, res) {
    let attributes = req.userAttributes || {};
    User.findById(req.params.userId, attributes, function(err, user) {
        if (err)
            res.send(err);
        else
            res.json(user);
    });
};

// creates an user
exports.create = function(req, res) {
    var new_User = new User(req.body);
    new_User.save(function(err, user) {
        if (err)
            res.send(err);
        else
            res.json(user);
    });
};

// DEPRECATED
function computeAddress(address) {
    return {
        placeId: 'fake place id',
        placeName: address
    };
}

// normal update, we only allow certain attributes
exports.updateNormal = function(req, res) {
    User.findByIdAndUpdate(req.params.userId,
    {
        completeName: req.body.completeName,
        email: req.body.email,
        phone: req.body.phone,
        profilePic: req.body.profilePic,
        notifications: req.body.notifications
    }, function(err, user) {
        if (err)
            res.send(err);
        else
            res.send(200);
    });
};

// entity update, we allow certain other attributes
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

// updates the user coordinates 
exports.updateCoords = function(req, res) {
    
    let update = {};
    update['place.lat'] = req.body.lat;
    update['place.long'] = req.body.long;

    // if an entity was selected during the location register, we will update the user entity
    if (req.entity) update['entity'] = req.entity.id;

    User.findByIdAndUpdate(req.userId, update, function(err, user) {
        if (err) return res.send(err);
        else return res.json({success:true});
    });
}

// debug feature
exports.updateCoords2 = function(req, res) {
    
    let update = {};
    update['place.lat'] = req.body.latitude;
    update['place.long'] = req.body.longitude;

    if (req.entity) update['entity'] = req.entity.id;

    User.findByIdAndUpdate(req.userId, update, function(err, user) {
        if (err) res.send(err);
        else res.json({success:true});
    });
}


// removes an user
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

// removes all users
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

// gets emergency phones
exports.getEmergencyPhones = function(req, res) {
    User.findOne({_id: req.params.userId}, function(err, user) {
        if (err) return res.send(err);
        else if (!user) return res.status(404).send('User not found');
        return res.json(user.contactPhones);
    });
}

// sets emergency phones
exports.setEmergencyPhones = function(req, res) {
    User.findOneAndUpdate({_id: req.params.userId}, {contactPhones: req.body}, function(err, user) {
        if (err) return res.send(err);
        if (!user) return res.status(404).send("User not found");
        return res.status(200).send("Success");
    });
}

// checks if an user exists on the database
// since unique restrictions are kinda unwanted to implement on mongo
// we perform a manual check with our own login
exports.userNotExists = function(object, finalCallback) {
    let email = object.email;
    let username = object.username;
    let phone = object.phone;

    // performs all operations in parallel. Results are processed in an single thread
    // once they are all done
    // Finds users given the email, username and phone. They should all be unique
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
        // if any user was found we perform the callback with the given user
        else if (results.userE) finalCallback(null,results.userE);
        else if (results.userU) finalCallback(null,results.userU);
        else if (results.userP) finalCallback(null,results.userP);
        // if no user was found, we callback with every parameter set at null
        else finalCallback(null);
    });
}

// blocks an user
exports.block = function(req, res) {
    User.findOneAndUpdate({_id: req.user._id},
    {   
        $push: {blocked: req.params.userId}
    }, function(err) {
        if (err) return res.status(500).send("internal server error");
        else return res.status(200).send("User successfully blocked");
    });
}

// unblocks an user
exports.unblock = function(req, res) {
    User.findOneAndUpdate({_id: req.user._id},
    {   
        $pull: {blocked: req.params.userId } 
    }, function(err) {
        if (err) return res.status(500).send("internal server error");
        else return res.status(200).send("User unblocked");
    });
}


