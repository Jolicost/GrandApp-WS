const {
    getObjectId
} = require('../index');

var moment = require('moment');

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function generateRandomInterval(hoursFrom, duration) {
    return {
        start: moment().add(hoursFrom, 'hours').format(),
        end: moment().add(hoursFrom + duration, 'hours').format()
    };
}

function generateInterval() {
    return generateRandomInterval(getRandomInt(5), 1 + getRandomInt(5));
}





const start = moment();
var end = moment().add(5, 'hours');
//end = end.add(5,'hours');

var activities = [{
        "title": "Activitat de prova del Joan",
        "description": "Aquesta es una activitat de prova que el Joan ha ficat amb POSTMAN",
        "participants": [getObjectId("Putin")],
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
        "capacity": 324,
        "_id": getObjectId("ActivitatTrump")
    },
    {
        "title": "Activitat de la iaia toneta",
        "description": "Anem tots a escoltar la radio",
        "participants": [getObjectId("Putin"), getObjectId("Trump")],
        "rating": 4,
        "activityType": "Escoltar radio",
        "price": 0,
        "images": [
            "https://i.imgur.com/kiCf30f.jpg",
            "https://i.imgur.com/q0oKo.jpg"
        ],
        "lat": 41.3879225,
        "long": 2.1366948,
        "user": getObjectId("IaiaToneta"),
        "address": "el meu carrer principal",
        "capacity": 4,
        "_id": getObjectId("ActivitatIaia")
    }
];

activities.forEach(function(activity) {
    var ts = generateInterval();
    activity['timestampStart'] = ts.start;
    activity['timestampEnd'] = ts.end;
});

module.exports = activities;
