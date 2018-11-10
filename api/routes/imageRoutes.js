'use strict';
module.exports = function(app) {
    var image = require('../controllers/imageController');
    // Image api routes
    app.route('/images')
        .post(image.create) 
        .get(image.test);

    app.route('/imagesJson')
        .post(image.createJson)
        .get(image.test);

    app.route('/imagesJsonPlain')
        .post(image.createJsonPlain)
        .get(image.test);

}