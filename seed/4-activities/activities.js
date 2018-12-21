const {
    getObjectId
} = require('../index');

var moment = require('moment');

var future = true;

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function generateRandomInterval(hoursFrom, duration) {
    let i = future ? 1:-1;
    return {
        start: new Date(moment().add(hoursFrom*i, 'hours').format()),
        end: new Date(moment().add(hoursFrom*i + duration, 'hours').format())
    };
}

function generateInterval() {
    return generateRandomInterval(getRandomInt(10), 1 + getRandomInt(5));
}

const start = moment();
var end = moment().add(5, 'hours');
//end = end.add(5,'hours');

var activities = [{
        title: "Activitat de prova del Joan",
        description: "Aquesta es una activitat de prova que el Joan ha ficat amb POSTMAN",
        participants: [getObjectId("UserPutin")],
        rating: 0,
        votes: [],
        activityType: "Pachangas",
        price: 0,
        images: [
            "https://i.imgur.com/raZVoMB.jpg",
            "https://i.imgur.com/raZVoMB.jpg"
        ],
        lat: 41.405060,
        long: 2.174270,
        user: getObjectId("UserTrump"),
        address: "Av. de Gaudí, 3, 08025 Barcelona, España",
        capacity: 324,
        _id: getObjectId("ActivityTest1"),
        place: {
            placeId: "ChIJ-Ya_TcOipBIRroYz68rqfBc",
            placeName: "Av. de Gaudí, 3, 08025 Barcelona, España"
        },
        entity: getObjectId('EntityBarcelona')
    },
    {
        title: "Activitat de prova del Joan",
        description: "Aquesta es una activitat de prova que el Joan ha ficat amb POSTMAN",
        participants: [getObjectId("UserPutin"),getObjectId("UserIaiaToneta")],
        rating: 0,
        votes: [],
        activityType: "Pachangas",
        price: 3,
        images: [
            "https://i.imgur.com/raZVoMB.jpg",
            "https://i.imgur.com/raZVoMB.jpg"
        ],
        lat: 41.405060,
        long: 2.174270,
        user: getObjectId("UserTrump"),
        address: "Av. de Gaudí, 3, 08025 Barcelona, España",
        capacity: 324,
        _id: getObjectId("ActivityTrump1"),
        place: {
            placeId: "ChIJ-Ya_TcOipBIRroYz68rqfBc",
            placeName: "Av. de Gaudí, 3, 08025 Barcelona, España"
        },
        entity: getObjectId('EntityBarcelona')
    },
    {
        title: "Activitat de la iaia toneta",
        description: "Anem tots a escoltar la radio",
        participants: [getObjectId("UserTrump"), getObjectId("UserDespistao")],
        rating: 4,
        votes: [
            {
                user: getObjectId("UserTrump"),
                rating: 4
            }
        ],
        activityType: "Escoltar radio",
        price: 0,
        images: [
            "https://i.imgur.com/kiCf30f.jpg",
            "https://i.imgur.com/q0oKo.jpg"
        ],
        lat: 41.582890,
        long: 1.617280,
        user: getObjectId("UserIaiaToneta"),
        address: "el meu carrer principal",
        capacity: 4,
        _id: getObjectId("ActivityTest2"),
        place: {
            placeId: "EjZDYXJyZXIgZGUgU2FudCBNYWfDrSwgMDg3MDAgSWd1YWxhZGEsIEJhcmNlbG9uYSwgU3BhaW4iLiosChQKEgljr_B652mkEhF9PHUCb3UcbhIUChIJhSfSCt1ppBIRV1q4GfLAcoM",
            placeName: "Carrer de Sant Magí, 08700 Igualada, Barcelona, Spain"
        },
        entity: getObjectId('EntityIgualada')
    },
    {
        title: "Activitat de la iaia toneta 2",
        description: "Ara vull fer skateboard",
        participants: [getObjectId("UserPutin"), getObjectId("UserTrump"), getObjectId("UserIaiaToneta")],
        rating: 7,
        votes: [],
        activityType: "Skateboard",
        price: 1,
        images: [
            "https://i.imgur.com/kiCf30f.jpg",
            "https://i.imgur.com/q0oKo.jpg"
        ],
        lat: 41.582890,
        long: 1.617280,
        user: getObjectId("UserIaiaToneta"),
        address: "el meu carrer principal",
        capacity: 4,
        _id: getObjectId("ActivityTest3"),
        place: {
            placeId: "EjZDYXJyZXIgZGUgU2FudCBNYWfDrSwgMDg3MDAgSWd1YWxhZGEsIEJhcmNlbG9uYSwgU3BhaW4iLiosChQKEgljr_B652mkEhF9PHUCb3UcbhIUChIJhSfSCt1ppBIRV1q4GfLAcoM",
            placeName: "Carrer de Sant Magí, 08700 Igualada, Barcelona, Spain"
        },
        entity: getObjectId('EntityBarcelona')
    },
    {
        title: "Activitat de la iaia toneta 3",
        description: "Ara vull fer skateboard maxim",
        participants: [getObjectId("UserPutin"), getObjectId("UserIaiaToneta")],
        rating: 7,
        votes: [],
        activityType: "Skateboard",
        price: 1,
        images: [
            "https://i.imgur.com/kiCf30f.jpg",
            "https://i.imgur.com/q0oKo.jpg"
        ],
        lat: 41.582890,
        long: 1.617280,
        user: getObjectId("UserIaiaToneta"),
        address: "el meu carrer principal",
        capacity: 4,
        _id: getObjectId("ActivityTest4"),
        place: {
            placeId: "EjZDYXJyZXIgZGUgU2FudCBNYWfDrSwgMDg3MDAgSWd1YWxhZGEsIEJhcmNlbG9uYSwgU3BhaW4iLiosChQKEgljr_B652mkEhF9PHUCb3UcbhIUChIJhSfSCt1ppBIRV1q4GfLAcoM",
            placeName: "Carrer de Sant Magí, 08700 Igualada, Barcelona, Spain"
        },
        entity: getObjectId('EntityBarcelona')
    }
];

activities.forEach(function(activity) {
    var ts = generateInterval();
    activity.timestampStart = ts.start;
    activity.timestampEnd = ts.end;
});

module.exports = activities;
