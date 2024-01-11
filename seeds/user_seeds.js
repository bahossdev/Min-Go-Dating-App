const { Users } = require('../models');

const userData = [
  {
    first_name: 'Jane Doe',
    age: 25,
    gender: "Female",
    location: "Tornto",
    status: "Single", 
    education: "Bachelors",
    email: "janedoe@gmail.com",
  },
  
  {
    first_name: 'Johnny Appleseed',
    age: 27,
    gender: "Male",
    location: "Tornto",
    status: "Single", 
    education: "Masters",
    email: "johnnyapple@gmail.com",
  }, 
  
  {
    first_name: 'Aubrey Graham',
    age: 37,
    gender: "Male",
    location: "Tornto",
    status: "Single", 
    education: "High School",
    email: "drake@ovosound.com",
  }, 
  
  {
    first_name: 'Justin Bieber',
    age: 29,
    gender: "Male",
    location: "Tornto",
    status: "Married", 
    education: "High School",
    email: "JustinBiebs@gmail.com",
  }, 
  
  {
    first_name: 'Avril Lavigne',
    age: 39,
    gender: "Female",
    location: "Tornto",
    status: "Single", 
    education: "Bachelors",
    email: "sk8ergirl@gmail.com",
  },
];

const seedUsers = () => Users.bulkCreate(userData);

module.exports = seedUsers;
