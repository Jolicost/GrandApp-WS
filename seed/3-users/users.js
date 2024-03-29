const {
    getObjectId
} = require('../index');

const bcrypt = require('bcryptjs');
var passwordHash = require('password-hash');

function hashPassword(password) {
    return passwordHash.generate(password);
    //return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

const users = [{
        _id: getObjectId('UserTrump'),
        username: 'trump',
        email: 'trump@whitehouse.com',
        password: hashPassword('america'),
        completeName: 'real donald trump',
        birthday: new Date('1946-06-14'),
        profilePic: 'https://i.imgur.com/h4MKiw2.jpg',
        phone: '+341234',
        contactPhones: [
        {
            alias: "casa",
            phone: '+34 123 456 788' 
        },
        {
            alias: "mama",
            phone: '+34 987 987 987'
        }
        ],
        createdAt: new Date('2018-04-04'),
        userType: 'normal',
        nRequests: 5,
        place: {
            placeId: 'ChIJDYlFNoSYpBIRjmAEsI979MA',
            placeName: 'Carrer de Sants, 53, 08014 Barcelona, España',
            lat: 41.405060,
            long: 2.174270
        },
        blocked: [],
        points: 500,
        achievements: [
            getObjectId('AchCadete'),
            getObjectId('AchNovato'),
            getObjectId('AchVeterano')
        ],
        entity: getObjectId('EntityBarcelona')
    },
    {
        _id: getObjectId('UserPutin'),
        username: 'putin',
        email: 'slav@russia.ru',
        password: hashPassword('russia'),
        completeName: 'vladimir putin',
        birthday: new Date('1952-08-07'),
        phone: '+346666',
        contactPhones: [
        {
            alias: "casa",
            phone: '+34 123 456 788' 
        },
        {
            alias: "mama",
            phone: '+34 987 987 987'
        }
        ],
        createdAt: new Date('2018-05-05'),
        userType: 'normal',
        nRequests: 5,
        blocked: [],
        points: 300,
        place: {
            placeId: 'EitQbGHDp2EgZGUgQ2F0YWx1bnlhLCAwODAwMiBCYXJjZWxvbmEsIFNwYWluIi4qLAoUChIJXQ1dXPGipBIRdJPxPA1EZ5USFAoSCeUwjnEWmKQSEQpmR089',
            placeName: 'Plaça de Catalunya, 08002 Barcelona, España',
            lat: 41.405060,
            long: 2.174270
        },
        entity: getObjectId('EntityBarcelona')

    },
    {
        _id: getObjectId('UserIaiaToneta'),
        username: 'iaiatoneta',
        email: 'iaia@toneta.com',
        password: hashPassword('radio'),
        completeName: 'iaia toneta toneta',
        birthday: new Date('1930-08-03'),
        profilePic: 'https://pbs.twimg.com/profile_images/1065195071899934721/MUsaUkS4_400x400.jpg',
        phone: '+34666123123',
        contactPhones: [],
        createdAt: new Date('2018-01-01'),
        userType: 'normal',
        place: {
            placeId: 'Ej5BdmluZ3VkYSBkZWwgTWVzdHJlIE1vbnRhbmVyLCAwODcwMCBJZ3VhbGFkYSwgQmFyY2Vsb25hLCBTcGFpbiIuKiwKFAoSCRPVuvveaaQSEXsLV8z82vRjEhQKEgmFJ9IK3WmkEhFXWrgZ8sBygw',
            placeName: 'Avinguda del Mestre Montaner, 08700 Igualada, Barcelona, España',
            lat: 41.58098,
            long: 1.6172
        },
        achievements: [
            getObjectId('AchCadete'),
            getObjectId('AchNovato'),
            getObjectId('AchVeterano')
        ],
        entity: getObjectId('EntityIgualada')

    },
    {
        _id: getObjectId('UserDespistao'),
        username: 'despistao',
        email: 'despistao@despiste.com',
        password: hashPassword('despistao'),
        completeName: 'el despistao',
        birthday: new Date('1969-08-03'),
        profilePic: 'https://pbs.twimg.com/profile_images/1065195071899934721/MUsaUkS4_400x400.jpg',
        phone: '+344321',
        contactPhones: [{
            alias: "madre",
            phone: '+34 123 123 123'
        }],
        createdAt: new Date('2018-01-02'),
        userType: 'normal',
        place: {
            placeId: 'Ej5BdmluZ3VkYSBkZWwgTWVzdHJlIE1vbnRhbmVyLCAwODcwMCBJZ3VhbGFkYSwgQmFyY2Vsb25hLCBTcGFpbiIuKiwKFAoSCRPVuvveaaQSEXsLV8z82vRjEhQKEgmFJ9IK3WmkEhFXWrgZ8sBygw',
            placeName: 'Avinguda del Mestre Montaner, 08700 Igualada, Barcelona, España',
            lat: 41.390205,
            long: 2.154007
        },
        entity: getObjectId('EntityIgualada')

    },
    {
        _id: getObjectId('UserTurista'),
        username: 'turista',
        email: 'turista@turista.com',
        password: hashPassword('turista'),
        completeName: 'turista extranjero',
        birthday: new Date('1969-08-03'),
        profilePic: 'https://pbs.twimg.com/profile_images/1065195071899934721/MUsaUkS4_400x400.jpg',
        phone: '+349999',
        contactPhones: [{
            alias: "mother",
            phone: '+3412341233234'
        }],
        createdAt: new Date('2018-01-02'),
        userType: 'normal',
        place: {
            placeId: 'Ej5BdmluZ3VkYSBkZWwgTWVzdHJlIE1vbnRhbmVyLCAwODcwMCBJZ3VhbGFkYSwgQmFyY2Vsb25hLCBTcGFpbiIuKiwKFAoSCRPVuvveaaQSEXsLV8z82vRjEhQKEgmFJ9IK3WmkEhFXWrgZ8sBygw',
            placeName: 'Avinguda del Mestre Montaner, 08700 Igualada, Barcelona, España',
            lat: 41.58098,
            long: 1.6172
        },
        entity: getObjectId('EntityBarcelona')

    },
    {
        _id: getObjectId('UserPijo'),
        username: 'pijo',
        email: 'pijo@pedralbes.com',
        password: hashPassword('pijo'),
        completeName: 'pijo de pedralbes',
        birthday: new Date('1969-08-03'),
        profilePic: 'https://pbs.twimg.com/profile_images/1065195071899934721/MUsaUkS4_400x400.jpg',
        phone: '+347777',
        contactPhones: [{
            alias: "mother",
            phone: '+341233234'
        }],
        createdAt: new Date('2018-01-02'),
        userType: 'normal',
        place: {
            placeId: 'Ej5BdmluZ3VkYSBkZWwgTWVzdHJlIE1vbnRhbmVyLCAwODcwMCBJZ3VhbGFkYSwgQmFyY2Vsb25hLCBTcGFpbiIuKiwKFAoSCRPVuvveaaQSEXsLV8z82vRjEhQKEgmFJ9IK3WmkEhFXWrgZ8sBygw',
            placeName: 'Avinguda del Mestre Montaner, 08700 Igualada, Barcelona, España',
            lat: 41.58098,
            long: 1.6172
        },
        entity: getObjectId('EntityBarcelona')

    },
    {
        _id: getObjectId('UserRaski'),
        username: 'raski',
        email: 'raski@raski.com',
        password: hashPassword('raski'),
        completeName: 'raski raski raski',
        birthday: new Date('1955-08-03'),
        profilePic: 'https://pbs.twimg.com/profile_images/1065195071899934721/MUsaUkS4_400x400.jpg',
        phone: '+34666',
        contactPhones: [],
        createdAt: new Date('2018-01-02'),
        userType: 'normal',
        place: {
            placeId: 'Ej5BdmluZ3VkYSBkZWwgTWVzdHJlIE1vbnRhbmVyLCAwODcwMCBJZ3VhbGFkYSwgQmFyY2Vsb25hLCBTcGFpbiIuKiwKFAoSCRPVuvveaaQSEXsLV8z82vRjEhQKEgmFJ9IK3WmkEhFXWrgZ8sBygw',
            placeName: 'Avinguda del Mestre Montaner, 08700 Igualada, Barcelona, España',
            lat: 41.53005,
            long: 1.68651
        },
        entity: getObjectId('EntityBarcelona')

    },
    {
        _id: getObjectId('UserSergio1'),
        username: 'sergio1',
        email: 'sergio1@sergio.com',
        password: hashPassword('sergio1'),
        completeName: 'sergio preciado 1',
        birthday: new Date('1955-08-03'),
        profilePic: 'https://pbs.twimg.com/profile_images/1065195071899934721/MUsaUkS4_400x400.jpg',
        phone: '+348888',
        contactPhones: [],
        createdAt: new Date('2018-01-02'),
        userType: 'normal',
        place: {
            placeId: 'Ej5BdmluZ3VkYSBkZWwgTWVzdHJlIE1vbnRhbmVyLCAwODcwMCBJZ3VhbGFkYSwgQmFyY2Vsb25hLCBTcGFpbiIuKiwKFAoSCRPVuvveaaQSEXsLV8z82vRjEhQKEgmFJ9IK3WmkEhFXWrgZ8sBygw',
            placeName: 'Avinguda del Mestre Montaner, 08700 Igualada, Barcelona, España',
            lat: 41.5064862,
            long: 2.39124558
        },
        entity: getObjectId('EntityBarcelona')

    },
    {
        _id: getObjectId('UserSergio2'),
        username: 'sergio2',
        email: 'sergio2@sergio.com',
        password: hashPassword('sergio2'),
        completeName: 'sergio preciado 2',
        birthday: new Date('1955-08-03'),
        profilePic: 'https://pbs.twimg.com/profile_images/1065195071899934721/MUsaUkS4_400x400.jpg',
        phone: '+345555',
        contactPhones: [],
        createdAt: new Date('2018-01-02'),
        userType: 'normal',
        place: {
            placeId: 'Ej5BdmluZ3VkYSBkZWwgTWVzdHJlIE1vbnRhbmVyLCAwODcwMCBJZ3VhbGFkYSwgQmFyY2Vsb25hLCBTcGFpbiIuKiwKFAoSCRPVuvveaaQSEXsLV8z82vRjEhQKEgmFJ9IK3WmkEhFXWrgZ8sBygw',
            placeName: 'Avinguda del Mestre Montaner, 08700 Igualada, Barcelona, España',
            lat: 41.5064862,
            long: 2.39124558
        },
        entity: getObjectId('EntityBarcelona')
    },
    {
        _id: getObjectId('UserService'),
        completeName: 'google facebook',
        birthday: new Date('1955-08-03'),
        profilePic: 'https://pbs.twimg.com/profile_images/1065195071899934721/MUsaUkS4_400x400.jpg',
        auth: {
            facebook: {
                token: 'facebook',
            }
        },
        contactPhones: [],
        createdAt: new Date('2018-01-02'),
        userType: 'normal',
        place: {
            placeId: 'Ej5BdmluZ3VkYSBkZWwgTWVzdHJlIE1vbnRhbmVyLCAwODcwMCBJZ3VhbGFkYSwgQmFyY2Vsb25hLCBTcGFpbiIuKiwKFAoSCRPVuvveaaQSEXsLV8z82vRjEhQKEgmFJ9IK3WmkEhFXWrgZ8sBygw',
            placeName: 'Avinguda del Mestre Montaner, 08700 Igualada, Barcelona, España',
            lat: 41.53005,
            long: 1.68651
        },
        entity: getObjectId('EntityBarcelona')

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
