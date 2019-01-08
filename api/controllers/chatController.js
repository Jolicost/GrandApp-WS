'use strict';

const Scaledrone = require('scaledrone-node');
const sd = new Scaledrone('p0gOL0KDsTT7G0Pd');

exports.roomMessages = function(req, res) {

    console.log("Entering room messages");
    let roomId = req.params.roomId;
    let messCount = req.activity.nMessages;

    console.log("Nombre de missates" + messCount);

    console.log("Entering " + roomId);

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

        room.on('history_message', message => {
            arrayResp.push(message);
            count++;
            console.log(message);
            console.log("count = " + count);
            if(count == messCount) {
                console.log("End = " + count);
                return res.json(arrayResp);
            }
        });
    } else {
        console.log("No hi ha historial encara");
        return res.json([]);
    }
};
