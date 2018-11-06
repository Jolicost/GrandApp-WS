const { getObjectId } = require('../index');

const users = [
  {
    _id: getObjectId('Trump'),
    username: 'trump',
    password: 'trump'
  }
];

module.exports = users;