const Interests = require('./Interests');
const Users = require('./Users');
const Meetup = require('./Meetup');

//Users belongToMany Intersts (through : 'userInterests')
Users.belongsToMany(Interests, {
    through: 'user_interest',
})


Interests.belongsToMany(Users, {
    through: 'user_interest',
})

//Users are connected to other users through meetup
Users.belongsToMany(Meetup, {
    through: 'user_meetup',
})

Meetup.belongsToMany(Users, {
    through: 'user_meetup',
})

module.exports = { Interests, Users, Meetup };