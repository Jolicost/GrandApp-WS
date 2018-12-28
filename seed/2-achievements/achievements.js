const {
    getObjectId
} = require('../index');

let hiddenImage = 'https://image.freepik.com/free-icon/question-mark_318-52837.jpg';

var achievements = [
    {
        _id: getObjectId('AchCadete'),
        title: 'Cadete',
        achievementType: 'number',
        key: 1,
        value: 10,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Navy_and_Marine_Corps_Achievement_Medal_ribbon.gif/800px-Navy_and_Marine_Corps_Achievement_Medal_ribbon.gif',     
        hiddenImage: hiddenImage
    },
    {
        _id: getObjectId('AchSoldado'),
        title: 'Soldado',
        achievementType: 'number',
        key: 10,
        value: 100,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Navy_and_Marine_Corps_Achievement_Medal_ribbon%2C_6th_award.svg/1920px-Navy_and_Marine_Corps_Achievement_Medal_ribbon%2C_6th_award.svg.png',     
        hiddenImage: hiddenImage
    },
    {
        _id: getObjectId('AchNovato'),
        title: 'Novato',
        achievementType: 'create',
        key: 1,
        value: 20,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Navy_and_Marine_Corps_Achievement_Medal_ribbon%2C_6th_award.svg/1920px-Navy_and_Marine_Corps_Achievement_Medal_ribbon%2C_6th_award.svg.png',     
        hiddenImage: hiddenImage
    },
    {
        _id: getObjectId('AchVeterano'),
        title: 'Veterano',
        achievementType: 'create',
        key: 5,
        value: 500,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Navy_and_Marine_Corps_Achievement_Medal_ribbon%2C_6th_award.svg/1920px-Navy_and_Marine_Corps_Achievement_Medal_ribbon%2C_6th_award.svg.png',     
        hiddenImage: hiddenImage
    },
    {
        _id: getObjectId('AchFamoso'),
        title: 'Famoso',
        achievementType: 'popular',
        key: 1,
        value: 100,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Navy_and_Marine_Corps_Achievement_Medal_ribbon%2C_6th_award.svg/1920px-Navy_and_Marine_Corps_Achievement_Medal_ribbon%2C_6th_award.svg.png',     
        hiddenImage: hiddenImage
    },
    {
        _id: getObjectId('AchFiestero'),
        title: 'Fiestero',
        achievementType: 'popular',
        key: 100,
        value: 1000,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Navy_and_Marine_Corps_Achievement_Medal_ribbon%2C_6th_award.svg/1920px-Navy_and_Marine_Corps_Achievement_Medal_ribbon%2C_6th_award.svg.png',     
        hiddenImage: hiddenImage
    }
];


module.exports = achievements;
