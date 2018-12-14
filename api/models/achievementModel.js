'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AchievementSchema = new Schema({
    //_id is implicit
    title: {
        type: String,
        default: "Grandapp achievement"
    },
    achievementType: {
        type: String,
        enum: [
            'number',
            'create',
            'popular'
        ],
        default: "number"
    },
    // Number to reach
    key: Number,
    // Reward points
    value: Number,
    // achievement image url
    image: String,
    // black image when user does not have the achievement
    hiddenImage: String,
});

// Make the model visible to other modules across mongoose
module.exports = mongoose.model('Achievements', AchievementSchema);
