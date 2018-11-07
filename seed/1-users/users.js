const { getObjectId } = require('../index');

const bcrypt = require('bcryptjs');

const users = [
  {
    _id: getObjectId('Trump'),
    username: 'trump',
    email: 'trump@whitehouse.com',
    password: bcrypt.hashSync('america', 8)
  }
];

module.exports = users;