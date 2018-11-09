'use strict';
module.exports = function(app) {
    var image = require('../controllers/imageController');
    // Image api routes
    app.route('/images')
        .post(image.create)    
}