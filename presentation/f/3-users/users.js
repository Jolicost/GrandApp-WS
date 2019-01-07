const {
    getObjectId
} = require('../../index');

const bcrypt = require('bcryptjs');
var passwordHash = require('password-hash');
var _ = require("underscore");
var maxUsers = 1000;

function hashPassword(password) {
    return passwordHash.generate(password);
    //return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

const users = [
    {
        _id: getObjectId('F.SuperAdmin.1'),
        username: 'admin',
        password: hashPassword('admin'),
        userType: 'admin',
    },
    {
    	_id: getObjectId('F.UserEntity.1'),
    	username: "nexus",
    	password: hashPassword('nexus'),
    	userType: 'entity',
    	entity: getObjectId("F.Entity.1")
    },
    {
    	_id: getObjectId('F.User.1'),
    	username: "trump",
    	password: hashPassword('america'),
        email: "trump@whitehouse.com",
        phone: "+341234",
        completeName: "real donald trump",
        birthday: '1946-06-14',
        profilePic: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Donald_Trump_official_portrait_%28cropped%29.jpg/1200px-Donald_Trump_official_portrait_%28cropped%29.jpg',
    	userType: 'normal',
    	entity: getObjectId("F.Entity.1"),
        contactPhones: [
            {
                alias: 'obama',
                phone: '+34 999 999 999'
            }
        ]
    },
    {
        _id: getObjectId('F.User.2'),
        username: "putin",
        password: hashPassword('russia'),
        email: "putin@kremlin.com",
        phone: "+344321",
        completeName: "vladimir putin",
        birthday: '1952-08-07',
        profilePic: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Vladimir_Putin_%282017-07-08%29.jpg/225px-Vladimir_Putin_%282017-07-08%29.jpg',
        userType: 'normal',
        entity: getObjectId("F.Entity.1"),
        contactPhones: [
            {
                alias: 'lenin',
                phone: '+34 671 77 24 14'
            }
        ],
        blocked: [getObjectId('F.User.1')]
    }
];

module.exports = users;
