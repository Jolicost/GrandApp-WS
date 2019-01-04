const {
    getObjectId
} = require('../../index');

var _ = require("underscore");
var maxActivities = 100;


var users = require('../3-users/users');

var types = [
	'Dance',
	'Party',
	'Sports',
	'Music',
	'Art',
	'Talk',
	'Drink'	
]

function getRandomName() {
	let r = Math.random().toString(36).substring(7);
	return r;
}

function getUsersSample(index) {
	let n = users.length;
	return _.sample(users,_.random(0,n)).map(usr => {return usr._id});
}

function getRandomDate(from, to) {
    from = from.getTime();
    to = to.getTime();
    return new Date(from + Math.random() * (to - from));
}

function getRandomType() {
	return _.sample(types,1);
}
function createRandomActivities() {
	let ret = [];
	for (var i = 0; i < maxActivities; i++) {


		let start = getRandomDate(new Date('2018-12-01'), new Date('2018-12-31'));
		// Random interval between 1 and 5 hours
		let end = new Date(start.getTime() + _.random(1,5) * 1000 * 60 * 60);

		let participants = getUsersSample(i);

		let active = _.sample(participants,participants.length);

		let a = {
			_id: getObjectId('E.RandomActivity.' + i),
			title: getRandomName(),
			activityType: getRandomType(),
			timestampStart: start,
			timestampEnd: end,
			user: _.sample(users,1),
			participants: participants,
			active: active,
			rating: _.random(0,10),
			capacity: _.random(10,100),
			entity: getObjectId("E.Entity.1")
		};

		ret.push(a);
	}
	return ret;
}


/* Return random users */
module.exports = createRandomActivities();
