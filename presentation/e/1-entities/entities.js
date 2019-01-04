const {
    getObjectId
} = require('../../index');


var entities = [
	{
		_id: getObjectId('E.Entity.1'),
		alias: "A5",
		address: "Edifici A5",
		phone: "+34 000 000 000",
		place: {
			lat: 41.388902,
			long: 2.113186,
			max: 50
		}
	},
	{
		_id: getObjectId('E.Entity.2'),
		alias: "Nexus II",
		address: "Edifici Nexus II",
		phone: "+34 000 000 001",
		place: {
			lat: 41.388355,
			long: 2.114746,
			max: 50
		}
	}
];

module.exports = entities;

