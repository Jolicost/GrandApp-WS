'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/* 
User Schema
Represents an user in the application
An user can have multiple contributions, post in contributions and do other stuff
*/
var UserSchema = new Schema({
    //_id is implicit
    // Username
    username: {
        type: String,
        default: "",
    },
    // Password 
    password: {
        type: String,
        default: ""
    },
    // user email
    email: {
        type: String,
        default: "",
        index: {
            unique: true
        }
    },
    // complete user name
    completeName: {
        type: String,
        default: ""
    },
    // User birthday
    birthday: {
        type: Date,
        default: Date.now()
    },
    // user profile pic (URL)
    profilePic: {
        type: String,
        default: "http://profilepicturesdp.com/wp-content/uploads/2018/07/profile-default-picture-4.png"
    },
    // user phone
    phone: {
        type: String,
        default: ""
    },
    // contact phones (family phones)
    contactPhones: [{
        alias: String,
        phone: String
    }],
    // creation date
    createdAt: {
        type: Date,
        default: Date.now()
    },
    // user type
    userType: {
        type: String,
        enum: [
            'normal',
            'entity',
            'admin'
        ],
        default: "normal"
    },
    // ref to entity, applicable to both normal users and entity users
    entity: {
        type: Schema.Types.ObjectId,
        ref: 'Entities'
    },

    // user location
    place: {
        // DEPRECATED
        placeId: {
            type: String
        },
        // DEPRECATED
        placeName: {
            type: String
        },
        // latitude
        lat: {
            type: Number,
            default: 0.0
        },
        // longitude
        long: {
            type: Number,
            default: 0.0
        }
    },
    // auth credentials
    auth: {
        google: {
            token: String,
            id: String
        },
        facebook: {
            token: String,
            id: String
        }
    },
    // earned points via achievements
    points: {
        type: Number,
        default: 0
    },
    // achievements obtained
    achievements: [{
        type: Schema.Types.ObjectId,
        ref: 'Achievements'
    }],
    // last request date
    lastRequest: {
        type: Date,
        default: Date.now()
    },
    // number of requests
    nRequests: {
        type: Number,
        default: 0
    },
    // notifications settings
    notifications: {
        nearActivity: {
            type: Boolean,
            default: false
        },
        joinedActivity: {
            type: Boolean,
            default: false
        },
        finishedActivity: {
            type: Boolean,
            default: false
        }
    },
    // blocked users
    blocked: [{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }]
});


// Make the model visible to other modules across mongoose
module.exports = mongoose.model('Users', UserSchema);
