'use strict';

const Scaledrone = require('scaledrone-node');
const sd = new Scaledrone('p0gOL0KDsTT7G0Pd');

exports.roomMessages = function(req, res) {

    console.log("Entering room messages");
    let roomId = req.params.roomId;
    let messCount = req.params.messageCount;

    console.log("Entering " + roomId);

    let room = sd.subscribe(roomId, {
      historyCount: 100
    });

    var arrayResp = [];
    let message;
    let count = 0;

    room.on('history_message', message => {
      arrayResp.push(message);
      count++;
      console.log(message);
      console.log("count = " + count);
      if (count >= 100) {
        return res.json(arrayResp).send();
      } else if(count == messCount) {
        console.log("End = " + count);
        return res.json(arrayResp).send();
      }
    });
};
