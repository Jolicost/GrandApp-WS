'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Float = require('mongoose-float').loadType(mongoose);

// _id is implicid
var ActivitySchema = new Schema({
    // activity title
    title: {
        type: String
    },
    // activity description
    description: {
        type: String
    },
    // creation user. Will be replaced wit
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
    // activity rating
    rating: {
        type: Float,
        default: 0
    }
});

module.exports = mongoose.model('Activities', ActivitySchema);