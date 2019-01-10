'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/* 
Entity schema.
Represents an entity of the model
An entity operates under a zone
*/
var EntitySchema = new Schema({
    //_id is implicit
    // Name of the entity
    alias: {
        type: String,
        default: ""
    },
    // Operation places of the entity
    place: {
        // DEPRECATEDPlace id of the entity
        placeId: {
            type: String
        },
        // DEPRECATED string that represents the address of the place
        placeName: {
            type: String
        },
        /* Center location of the entity */
        lat: Number,
        long: Number,
        // action radius in meters
        max: Number
    },    
    // contact phone
    phone: {
        type: String,
        default: ""
    },
    // contact email
    email: {
        type: String,
        default: ""
    },
    // physical location of the entity (for consulting purposes)
    address: {
        type: String,
        default: ""
    }
});

// Make the model visible to other modules across mongoose
module.exports = mongoose.model('Entities', EntitySchema);
