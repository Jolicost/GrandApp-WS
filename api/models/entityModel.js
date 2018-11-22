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
        // Place id of the entity
        placeId: {
            type: String
        },
        // string that represents the address of the place
        placeName: {
            type: String
        }
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
