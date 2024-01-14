const router = require('express').Router();
const { User, Interest, UserInterest, Meetup, UserMeetup } = require('../../models');
const withAuth = require('../../utils/auth');

//Get all user
router.get('/', withAuth, async (req, res) => {
  try {
    const userData = await User.findAll(
    );
    const users = userData.map((user) => user.get({ plain: true }));

    res.render('users', {
      users,
      logged_in: req.session.logged_in
    });
    // res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get one user
router.get('/:id', async (req, res) => {
  try {
    const userData = await User.findByPk(req.params.id, {
      attributes: {
        exclude: ['password']
      },
      include: [
        {
          model: Interest,
          through: UserInterest,
        },
        {
          model: Meetup,
          through: UserMeetup,
        },
      ],
    });

    if (!userData) {
      res.status(404).json({ message: 'No user found with this id!' });
      return;
    };
    const user = userData.get({ plain: true });

    res.render('oneUser', {
      user,
      ...user,
      logged_in: req.session.logged_in
    });
    // res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  };
});

//Create new user
router.post('/', async (req, res) => {
  try {

    // req.session.user
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
    });

    // if (req.body.interests.length) {
    //   const userInterestArray = req.body.interests.map((interest_id) => {
    //     return {
    //       user_id: userData.id,
    //       interest_id,
    //     };
    //   });
    //   await UserInterest.bulkCreate(userInterestArray);
    // }
    // if (req.body.meetups.length) {
    //   const userMeetupArray = req.body.meetups.map((meetup_id) => {
    //     return {
    //       user_id: userData.id,
    //       meetup_id,
    //     };
    //   });
    //   await UserMeetup.bulkCreate(userMeetupArray);
    // }
    res.status(200).json(userData);

  } catch (err) {
    console.log(err)
    res.status(400).json(err);
  };
});

// Update a user
// withAuth
router.put('/:id', withAuth, async (req, res) => {
  try {

    // // this object can be accessed from anywhere in the back end and returned
    // // to the front end

    // req.session.user = req.body.user_id

    // // this return to the front end 
    // res.send(req.session)
    const userData = await User.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    //update their interest
    if (req.body.interests && req.body.interests.length) {
      const userInterestArray = await UserInterest.findAll({
        where: { user_id: req.params.id }
      })
      // create filtered list of new interest_ids
      const userInterests = userInterestArray.map(({ interest_id }) => interest_id);

      const newUserInterests = req.body.interests
        .filter((interest_id) => !userInterests.includes(interest_id))
        .map((interest_id) => {
          return {
            user_id: req.params.id,
            interest_id
          };
        });

      // figure out which ones to remove
      const userInterestsToRemove = userInterestArray
        .filter(({ interest_id }) => !req.body.interests.includes(interest_id))
        .map(({ id }) => id);

      // run both actions to update with new interests
      await Promise.all([
        UserInterest.destroy({ where: { id: userInterestsToRemove } }),
        UserInterest.bulkCreate(newUserInterests),
      ]);
    };

    //update their meetup
    if (req.body.meetups && req.body.meetups.length) {
      const userMeetupArray = await UserMeetup.findAll({
        where: { user_id: req.params.id }
      })
      // create filtered list of new meetup_ids
      const userMeetups = userMeetupArray.map(({ meetup_id }) => meetup_id);

      const newUserMeetups = req.body.meetups
        .filter((meetup_id) => !userMeetups.includes(meetup_id))
        .map((meetup_id) => {
          return {
            user_id: req.params.id,
            meetup_id
          };
        });

      // figure out which ones to remove
      const userMeetupsToRemove = userMeetupArray
        .filter(({ meetup_id }) => !req.body.meetups.includes(meetup_id))
        .map(({ id }) => id);

      // run both actions to update with new meetups
      await Promise.all([
        UserMeetup.destroy({ where: { id: userMeetupsToRemove } }),
        UserMeetup.bulkCreate(newUserMeetups),
      ]);
    };

    // Fetch the updated user data
    const updatedUser = await User.findByPk(req.params.id, {
      include: [
        {
          model: Interest,
          through: UserInterest,
        },
        {
          model: Meetup,
          through: UserMeetup,
        },
      ],
    });
    res.render('profile');
    // res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete a user
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const userData = await User.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!userData) {
      res.status(404).json({ message: 'No user found with this id!' });
      return;
    };

    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  };
});

//Login
router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    };

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    };
    console.log(userData);
    const userId = userData.dataValues.id;
    console.log(userId);
    res.cookie('user_id', userId);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  };
});

//Logout
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  };
});

module.exports = router;
