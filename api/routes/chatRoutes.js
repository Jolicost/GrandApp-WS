'use strict';
module.exports = function(app) {
    var chat = require('../controllers/chatController');

    app.get('/normal/message/:roomId/:messageCount',
        chat.roomMessages);
}
