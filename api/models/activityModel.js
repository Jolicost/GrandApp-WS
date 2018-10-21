'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ActivitySchema = new Schema({
    title: {
        type: String,
        required: 'Activity name'
    },
    description: {
        type: String,
        required: 'Activity description'
    }
});

module.exports = mongoose.model('Activities', ActivitySchema);