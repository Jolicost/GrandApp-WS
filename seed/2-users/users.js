const {
    getObjectId
} = require('../index');

const bcrypt = require('bcryptjs');

function hashPassword(password) {
    return bcrypt.hashSync(password, 8);
}

const users = [{
        _id: getObjectId('UserTrump'),
        username: 'trump',
        email: 'trump@whitehouse.com',
        password: hashPassword('america'),
        completeName: 'real donald trump',
        birthday: '1946-06-14',
        profilePic: 'https://i.imgur.com/h4MKiw2.jpg',
        phone: '+341234',
        contactPhones: [
            '+34 123 456 788',
            '+34 987 987 987'
        ],
        createdAt: '2018-04-04',
        userType: 'normal',
        place: {
            placeId: 'ChIJDYlFNoSYpBIRjmAEsI979MA',
            placeName: 'Carrer de Sants, 53, 08014 Barcelona, España'
        }
    },
    {
        _id: getObjectId('UserPutin'),
        username: 'putin',
        email: 'slav@russia.ru',
        password: hashPassword('russia'),
        completeName: 'vladimir putin',
        birthday: '1952-08-07',
        phone: '+34999999999',
        contactPhones: [
            '+34 123 456 789'
        ],
        createdAt: '2018-05-05',
        userType: 'normal',
        place: {
            placeId: 'EitQbGHDp2EgZGUgQ2F0YWx1bnlhLCAwODAwMiBCYXJjZWxvbmEsIFNwYWluIi4qLAoUChIJXQ1dXPGipBIRdJPxPA1EZ5USFAoSCeUwjnEWmKQSEQpmR089',
            placeName: 'Plaça de Catalunya, 08002 Barcelona, España'
        }

    },
    {
        _id: getObjectId('UserIaiaToneta'),
        username: 'iaiatoneta',
        email: 'iaia@toneta.com',
        password: hashPassword('radio'),
        completeName: 'iaia toneta toneta',
        birthday: '1930-08-03',
        profilePic: 'https://pbs.twimg.com/profile_images/1065195071899934721/MUsaUkS4_400x400.jpg',
        phone: '+34666123123',
        contactPhones: [],
        createdAt: '2018-01-01',
        userType: 'normal',
        place: {
            placeId: 'Ej5BdmluZ3VkYSBkZWwgTWVzdHJlIE1vbnRhbmVyLCAwODcwMCBJZ3VhbGFkYSwgQmFyY2Vsb25hLCBTcGFpbiIuKiwKFAoSCRPVuvveaaQSEXsLV8z82vRjEhQKEgmFJ9IK3WmkEhFXWrgZ8sBygw',
            placeName: 'Avinguda del Mestre Montaner, 08700 Igualada, Barcelona, España'
        }

    },
    {
        _id: getObjectId('UserAdminBarcelona1'),
        username: 'barna1',
        entity: getObjectId('EntityBarcelona'),
        password: hashPassword('barna1'),
        userType: 'entity'
    },
    {
        _id: getObjectId('UserAdminBarcelona2'),
        username: 'barna2',
        entity: getObjectId('EntityBarcelona'),
        password: hashPassword('barna2'),
        userType: 'entity',
    },
    {
        _id: getObjectId('UserAdminIgualada1'),
        username: 'igualada1',
        entity: getObjectId('EntityIgualada'),
        password: hashPassword('igualada1'),
        userType: 'entity',
    },
    {
        _id: getObjectId('UserSuperAdmin'),
        username: 'admin',
        password: hashPassword('admin'),
        userType: 'admin',
    }
];

module.exports = users;
