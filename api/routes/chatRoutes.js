'use strict';
module.exports = function(app) {
    var chat = require('../controllers/chatController');
    var chatMdw = require('../middleware/chatMiddleware');

    // Gets number of messages from room
    app.get('/normal/message/:roomId', [
    	chatMdw.obtainActivity
    	], chat.roomMessages);
}
