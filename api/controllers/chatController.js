'use strict';

const Scaledrone = require('scaledrone-node');
const sd = new Scaledrone({
  channelId: 'p0gOL0KDsTT7G0Pd'
});

exports.roomMessages = function(req, res) {

    console.log("Entering room messages");
    let roomId = req.params.roomId;

    console.log("Entering " + roomId);

    let room = sd.subscribe(roomId, {
      historyCount: 5 // ask for the 5 most recent messages from the room's history
    });

    room.on('history_message', message => console.log(message));

    res.json(room.on('history_message', message));
};
