'use strict';

const Scaledrone = require('scaledrone-node-push');
const sd = new Scaledrone({
  channelId: 'p0gOL0KDsTT7G0Pd',
  secretKey: 'GJrnYzWZhSjrm8ZOnQC4oTnWxfJndfuT'
});

exports.roomMessages = function(req, res) {
    let roomId = req.params.roomId;

    let room = sd.subscribe(roomId, {
      historyCount: 5 // ask for the 5 most recent messages from the room's history
    });

    res.json(room.on('history_message', message));
};