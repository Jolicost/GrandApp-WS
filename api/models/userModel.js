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
        default: ""
    },
    // Password. Not crypted (for now)
    password: {
        type: String,
        default: ""
    },
    // user email
    email: {
        type: String,
        default: ""
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
        default: ""
    },
    // user phone
    phone: {
        type: String,
        default: ""
    },
    // contact phones (family phones)
    contactPhones: {
        type: [String]
    },
    // creation date
    createdAt: {
        type: Date,
        default: Date.now()
    },
    // user type
    userType: {
        type: String,
    },
    // auth credentials
    auth:{
        google: {
            token: {
                type: String
            },
            googleId: {
                type: String
            }
        }
    }
});

// Make the model visible to other modules across mongoose
module.exports = mongoose.model('Users', UserSchema);