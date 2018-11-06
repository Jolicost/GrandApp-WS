'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// _id is implicid
var ActivitySchema = new Schema({
    // activity title
    title: {
        type: String,
        default: ""
    },
    // activity description
    description: {
        type: String,
        default: ""
    },
    // creation user. Will be replaced wit
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'Users'
    },
    // Participants
    participants: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Users'
        }
    ],
    // activity rating
    rating: {
        type: Number,
        default: 0.0
    },
    // activity type
    activityType: {
        type: String,
        default: "default"
    },
    // max allowed capacity
    capacity: {
        type: Number
    },
    // activity price per person (0 means not applicable)
    price: {
        type: Number,
        default: 0.0
    },
    // Image URLs to diplay
    images: {
        type: [String]    
    },
    // activity location

    /* Nested location
    location: {
        lat: {
            type: Number,
            default: 0.0
        },
        long: {
            type: Number,
            default: 0.0
        },
        direction: {
            type: String,
            default: ""
        }
    },
    */
    lat: {
        type: Number,
        default: 0.0
    },
    long: {
        type: Number,
        default: 0.0
    },
    address: {
        type: String,
        default: ""
    },
    // activity start
    timestampStart: {
        type: Date,
        default: Date.now,
        get: toTimestamp
    },
    // activity end
    timestampEnd: {
        type: Date,
        default: Date.now,
        get: toTimestamp
    },

})
.set('toObject', { getters: true })
.set('toJSON', { getters: true });

/* Cast to miliseconds UTF */
function toTimestamp(date) {
    if (date) {
        return date.getTime();
    }
    else {
        return new Date(0);
    }
}

module.exports = mongoose.model('Activities', ActivitySchema);