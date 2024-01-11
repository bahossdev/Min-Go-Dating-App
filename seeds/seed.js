const sequelize = require('../config/connection');
const { User, Meetup, Interest, UserInterest, UserMeetup } = require('../models');

const userData = require('./user-seeds.json');
const meetupData = require('./meetup-seeds.json');
const interestData = require('./interest-seeds.json');
const userInterestData = require('./userInterest-seeds.json');
const userMeetupData = require('./userMeetup-seeds.json');


const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });
  const meetups = await Meetup.bulkCreate(meetupData, {
    individualHooks: true,
    returning: true,
  });
  const interests = await Interest.bulkCreate(interestData, {
    individualHooks: true,
    returning: true,
  });
  const userInterests = await UserInterest.bulkCreate(userInterestData, {
    individualHooks: true,
    returning: true,
  });
  const userMeetups = await UserMeetup.bulkCreate(userMeetupData, {
    individualHooks: true,
    returning: true,
  });
  process.exit(0);
}

seedDatabase();
