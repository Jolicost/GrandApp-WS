'use strict';
module.exports = function(app) {
    var chat = require('../controllers/chatController');
    var chatMdw = require('../middleware/chatMiddleware');

    app.get('/normal/message/:roomId', [
    	chatMdw.obtainActivity
    	], chat.roomMessages);
}
