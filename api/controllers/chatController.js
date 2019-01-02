'use strict';

const Scaledrone = require('scaledrone-node');
const sd = new Scaledrone('p0gOL0KDsTT7G0Pd');

exports.roomMessages = function(req, res) {

    console.log("Entering room messages");
    let roomId = req.params.roomId;

    console.log("Entering " + roomId);

    let room = sd.subscribe(roomId, {
      historyCount: 5
    });

    var arrayResp = [];
    let message;

    var myCallback = function() {
      console.log(arrayResp);
      return res.json(arrayResp);
    }

    var roomFunction = function(callback) {
      room.on('history_message', message => {
        arrayResp.push(message);
        console.log(arrayResp);
      });
    }

    roomFunction(myCallback);

    console.log("Response:  ------------------------- ");
};
