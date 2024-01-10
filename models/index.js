const Interests = require('./Interests');
const Users = require('./Users');
const Meetup = require('./Meetup');

//Users has
Users.hasMany(Interests, {
    foreignkey: 'users_id'
})

//Users are connected to other users through interests

//Users are connected to other users through meetup

module.exports = { Interests, Users, Meetup };
