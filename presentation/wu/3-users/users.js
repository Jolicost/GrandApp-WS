const {
    getObjectId
} = require('../../index');

const bcrypt = require('bcryptjs');
var passwordHash = require('password-hash');

function hashPassword(password) {
    return passwordHash.generate(password);
    //return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

const users = [
    {
        _id: getObjectId('UserSuperAdmin'),
        username: 'admin',
        password: hashPassword('admin'),
        userType: 'admin',
    }
];

module.exports = users;
