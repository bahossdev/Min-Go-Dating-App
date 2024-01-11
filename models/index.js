const Interest = require('./Interest');
const User = require('./User');
const Meetup = require('./Meetup');

//Users belongToMany Intersts (through : 'userInterests')
//through assigns new names for the tables
User.belongsToMany(Interest, {
    through: 'user_interest',
})


Interest.belongsToMany(User, {
    through: 'user_interest',
})

//Users are connected to other users through meetup
User.belongsToMany(Meetup, {
    through: 'user_meetup',
})

Meetup.belongsToMany(User, {
    through: 'user_meetup',
})

module.exports = { Interest, User, Meetup };