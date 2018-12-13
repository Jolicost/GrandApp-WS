const {
    getObjectId
} = require('../index');

var entities = [
    {
        _id: getObjectId('EntityBarcelona'),
        alias: 'Ajuntament de Barcelona',
        place: {
            placeId: "ChIJ5TCOcRaYpBIRCmZHTz37sEQ",
            placeName: "Barcelona, España",
            lat: 41.382318,
            long: 2.177274,
            max: 10000
        },      
        phone: "+34938057070",
        email: "ajuntament@barcelona.cat",
        address: "Carrer de Lepant, 387, 08025 Barcelona, España",
    },
    {
        _id: getObjectId('EntityIgualada'),
        alias: 'Ajuntament Igualada',
        place: {
            placeId: "ChIJhSfSCt1ppBIRV1q4GfLAcoM",
            placeName: "Igualada, Barcelona, España",
            lat: 41.578721,
            long: 1.617726,
            max: 10000
        },
        phone: "+34938058080",
        email: "ajuntament@igualada.cat",
        address: "Plaça de l'Ajuntament, 1, 08700 Igualada, Barcelona, España"
    }
];

module.exports = entities;
