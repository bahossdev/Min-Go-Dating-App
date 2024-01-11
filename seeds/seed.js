const sequelize = require('../config/connection');
const { User, Meetup, Interest } = require('../models');

const userData = require('./user-seeds.json');
const meetupData = require('./meetup-seeds.json');
const interestData = require('./interest-seeds.json');


const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  for (const meetup of meetupData) {
    await Meetup.create({
      ...meetup,
      user_id: users[Math.floor(Math.random() * users.length)].id,
    });
  }

  for (const interest of interestData) {
    await Interest.create({
      ...interest,
      user_id: users[Math.floor(Math.random() * users.length)].id,
    });
  }
  process.exit(0);
};

seedDatabase();
