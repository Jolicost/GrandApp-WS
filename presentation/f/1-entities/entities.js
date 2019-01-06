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
			lat: 41.388355,
			long: 2.114746,
			max: 200
		}
	}
];

module.exports = entities;

