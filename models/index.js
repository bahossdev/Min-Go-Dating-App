const Interest = require('./Interest');
const User = require('./User');
const Meetup = require('./Meetup');
const UserInterest = require('./UserInterest');
const UserMeetup = require('./UserMeetup');

//Users belongToMany Intersts (through : 'userInterests')
User.belongsToMany(Interest, {
    through: UserInterest,
    foreignKey: 'user_id',
    timestamps: false,
})

Interest.belongsToMany(User, {
    through: UserInterest,
    foreignKey: 'interest_id',
    timestamps: false,
})

//Users are connected to other users through meetup
User.belongsToMany(Meetup, {
    through: UserMeetup,
    foreignKey: 'user_id',
    timestamps: false,
})

Meetup.belongsToMany(User, {
    through: UserMeetup,
    foreignKey: 'meetup_id',
    timestamps: false,
})

module.exports = { Interest, User, Meetup, UserInterest, UserMeetup };



