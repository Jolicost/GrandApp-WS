'use strict';

const Scaledrone = require('scaledrone-node');
const sd = new Scaledrone('p0gOL0KDsTT7G0Pd');

// gets the room messages (activity) from scaledrone service
exports.roomMessages = function(req, res) {
    let roomId = req.params.roomId;
    let messCount = req.activity.nMessages;

    var arrayResp = [];
    let message;
    let count = 0;

    if(messCount != 0) {

        if(messCount > 100) {
            messCount = 100;
        }
      
        let room = sd.subscribe(roomId, {
            historyCount: 100
        });

        // return the request when we are happy enough (number of recieved messages equals to registered activity messages)
        room.on('history_message', message => {
            arrayResp.push(message);
            count++;
            if(count == messCount) {
                return res.json(arrayResp);
            }
        });
    } else {
        return res.json([]);
    }
};
