'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* Represents an activity */
var ActivitySchema = new Schema({
        // id is implicit

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
        // creation user. References Users
        user: {
            type: Schema.Types.ObjectId,
            ref: 'Users'
        },
        // Participants. Array of user references
        participants: [{
            type: Schema.Types.ObjectId,
            ref: 'Users'
        }],
        // Active participants. Determines if an user reached the activity (< 50m)
        active: [{
            type: Schema.Types.ObjectId,
            ref:'Users'
        }],
        // activity rating
        rating: {
            type: Number,
            default: 0.0
        },
        // tracking of votes. It is mandatory for the rating computation
        votes: [{
            // user who voted
            user: {
                type: Schema.Types.ObjectId,
                ref: 'Users'
            },
            // vote 
            rating: {
                type: Number,
                default: 0.0
            }
        }],
        // activity type
        activityType: {
            type: String,
            default: "default"
        },
        // max allowed capacity
        capacity: {
            type: Number
        },
        // activity price per person 
        price: {
            type: Number,
            default: 0.0
        },
        // Image URLs from the activity
        images: {
            type: [String]
        },
        // activity location
        lat: {
            type: Number,
            default: 0.0
        },
        long: {
            type: Number,
            default: 0.0
        },
        // DEPRECATED. Google place id and name
        place: {
            placeId: {
                type: String
            },
            placeName: {
                type: String
            }
        },
        // DEPRECATED Physical address. We didn't include it inside place because compatibility reasons
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
        // Activity entity. It can be null. An activity has an entity if it is located inside the entity range
        entity: {
            type: Schema.Types.ObjectId,
            ref: 'Entities'
        },
        // creation date
        createdAt: {
            type: Date,
            default: Date.now
        },
        // number of chat messages
        nMessages: {
            type: Number,
            default: 0
        }

    })
    .set('toObject', {
        getters: true
    })
    .set('toJSON', {
        getters: true
    });

/* Cast to miliseconds UTF */
function toTimestamp(date) {
    if (date) {
        return date.getTime();
    } else {
        return new Date(0);
    }
}

// module visible
module.exports = mongoose.model('Activities', ActivitySchema);
