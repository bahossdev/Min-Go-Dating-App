const router = require('express').Router();
const { Interest, User, Meetup } = require('../models');
const withAuth = require('../utils/auth');

//Get all interests
router.get('/', async (req, res) => {
  try {
    const interestData = await Interest.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const interests = interestData.map((interest) => interest.get({ plain: true }));

    res.render('homepage', {
      interests,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get a single interest
router.get('/interest/:id', async (req, res) => {
  try {
    const interestData = await Interest.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const interest = interestData.get({ plain: true });
    console.log(interest);

    res.render('interest', {
      ...interest,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Interest }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

module.exports = router;
