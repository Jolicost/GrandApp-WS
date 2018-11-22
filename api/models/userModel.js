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
        index: {
            unique: true
        }
    },
    // Password. Not crypted (for now)
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
        default: "https://i.imgur.com/jNNT4LE.png"
    },
    // user phone
    phone: {
        type: String,
        default: "",
        index: {
            unique: true
        }
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
    // user address calculated using postal code
    place: {
        placeId: {
            type: String
        },
        placeName: {
            type: String
        }
    },
    // auth credentials
    auth: {
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
