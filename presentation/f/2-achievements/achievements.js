const {
    getObjectId
} = require('../../index');

let hiddenImage = 'https://image.freepik.com/free-icon/question-mark_318-52837.jpg';

var achievements = [
    {
        _id: getObjectId('AchPrivate'),
        title: 'Private',
        achievementType: 'number',
        key: 1,
        value: 10,
        image: 'https://www.army.mil/e2/images/rv7/ranks/badges/enlisted/sm/private.png',     
        hiddenImage: hiddenImage
    },
    {
        _id: getObjectId('AchSpecialist'),
        title: 'Specialist',
        achievementType: 'number',
        key: 5,
        value: 100,
        image: 'https://www.army.mil/e2/images/rv7/ranks/badges/enlisted/sm/specialist.png',     
        hiddenImage: hiddenImage
    },
    {
        _id: getObjectId('AchSergeant'),
        title: 'Sergeant',
        achievementType: 'number',
        key: 10,
        value: 500,
        image: 'https://www.army.mil/e2/images/rv7/ranks/badges/enlisted/sm/sergeant.png',     
        hiddenImage: hiddenImage
    },
    {
        _id: getObjectId('AchMajor'),
        title: 'Novato',
        achievementType: 'create',
        key: 3,
        value: 100,
        image: 'https://www.army.mil/e2/images/rv7/ranks/badges/officer/sm/major.png',     
        hiddenImage: hiddenImage
    },
    {
        _id: getObjectId('AchLiutenant'),
        title: 'Liutenant',
        achievementType: 'create',
        key: 1,
        value: 20,
        image: 'https://www.army.mil/e2/images/rv7/ranks/badges/officer/sm/first_lieutenant.png',
        hiddenImage: hiddenImage
    },
    {
        _id: getObjectId('AchCaptain'),
        title: 'Captain',
        achievementType: 'create',
        key: 2,
        value: 50,
        image: 'https://www.army.mil/e2/images/rv7/ranks/badges/officer/sm/captain.png',     
        hiddenImage: hiddenImage
    },
    {
        _id: getObjectId('AchColonel'),
        title: 'Colonel',
        achievementType: 'popular',
        key: 1,
        value: 100,
        image: 'https://www.army.mil/e2/images/rv7/ranks/badges/officer/sm/colonel.png',
        hiddenImage: hiddenImage
    },
    {
        _id: getObjectId('AchGeneral'),
        title: 'General',
        achievementType: 'popular',
        key: 2,
        value: 250,
        image: 'https://www.army.mil/e2/images/rv7/ranks/badges/officer/sm/brigadier_general.png',
        hiddenImage: hiddenImage
    },
    {
        _id: getObjectId('AchVeteran'),
        title: 'Veteran',
        achievementType: 'popular',
        key: 3,
        value: 500,
        image: 'https://www.army.mil/e2/images/rv7/ranks/badges/officer/sm/general_of_the_army.png',
        hiddenImage: hiddenImage
    },
];

module.exports = achievements;