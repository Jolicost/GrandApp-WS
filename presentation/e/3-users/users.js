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
        _id: getObjectId('E.SuperAdmin.1'),
        username: 'admin',
        password: hashPassword('admin'),
        userType: 'admin',
    },
    {
    	_id: getObjectId('E.UserEntity.1'),
    	username: "fib",
    	password: hashPassword('fib'),
    	userType: 'entity',
    	entity: getObjectId("E.Entity.1")
    },
    {
    	_id: getObjectId('E.UserEntity.2'),
    	username: "nexus",
    	password: hashPassword('nexus'),
    	userType: 'entity',
    	entity: getObjectId("E.Entity.2")
    }
];

module.exports = users;
