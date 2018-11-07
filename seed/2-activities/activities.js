const { getObjectId } = require('../index');

const activities = [
    {
        "title": "Activitat de prova del Joan",
        "description": "Aquesta es una activitat de prova que el Joan ha ficat amb POSTMAN",
        "participants": [],
        "rating": 0,
        "activityType": "Pachangas",
        "price": 0,
        "images": [
            "https://i.imgur.com/raZVoMB.jpg",
            "https://i.imgur.com/raZVoMB.jpg"
        ],
        "lat": 83.2,
        "long": 32.3,
        "user": getObjectId("Trump"),
        "address": "calle falsa 123",
        "_id": "5bd5fd5df36a583899efb73d",
        "timestampEnd": 2342434242342,
        "capacity": 324,
        "timestampStart": 1540750685180,
        "__v": 0,
        "id": "5bd5fd5df36a583899efb73d"
    }
];

module.exports = activities;