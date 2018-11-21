const {
    getObjectId
} = require('../index');

const bcrypt = require('bcryptjs');

function hashPassword(password) {
    return bcrypt.hashSync(password, 8);
}

const users = [{
        _id: getObjectId('Trump'),
        username: 'trump',
        email: 'trump@whitehouse.com',
        password: hashPassword('america')
    },
    {
        _id: getObjectId('Putin'),
        username: 'putin',
        email: 'slav@russia.ru',
        password: hashPassword('russia')
    },
    {
        _id: getObjectId('IaiaToneta'),
        username: 'iaiatoneta',
        email: 'iaia@toneta.com',
        password: hashPassword('radio')
    }

];

module.exports = users;
