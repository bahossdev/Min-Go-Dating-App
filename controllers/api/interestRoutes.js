const router = require('express').Router();
const { Interest, User, UserInterest } = require('../../models');
const withAuth = require('../../utils/auth');

//Get all interest
router.get('/', withAuth, async (req, res) => {
  try {
    const interestData = await Interest.findAll();

    const interests = interestData.map((interest) => interest.get({ plain: true }));
    // res.status(200).json(interestData);
    res.render('interests', {
      interests,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  };
});

//Get a single interest
router.get('/:id', withAuth, async (req, res) => {
  try {
    const interestData = await Interest.findByPk(req.params.id, {
      include: [
        {
          model: User,
          through: UserInterest,
          attributes: {
            exclude: ['password']
          },
        },
      ],
    });
    if (!interestData) {
      res.status(404).json({ message: 'No interest found with this id!' });
      return;
    };

    const interest = interestData.get({ plain: true });
    res.render('oneInterest', {
      interest,
      logged_in: req.session.logged_in
    });
    // res.status(200).json(interestData);
  } catch (err) {
    res.status(500).json(err);
  };
});

//Create new interest
router.post('/', withAuth, async (req, res) => {
  try {
    const interestData = await Interest.create(req.body);

    // req.session.save(() => {
    //   req.session.interest_id = interestData.id;
    //   req.session.logged_in = true;

    //   // Render the 'interest' view with the newly created interest data
    //   res.render('interest', {
    //     ...interestData.get({ plain: true }),
    //     logged_in: true,
    //   });
    // });
    res.status(200).json(interestData);
  } catch (err) {
    res.status(400).json(err);
  };
});

//Update an interest
router.put('/:id', withAuth, async (req, res) => {
  try {
    const interestData = await Interest.update(req.body, {
      where: {
        id: req.params.id,
        // user_id: req.session.user_id,
      },
    });

    if (!interestData) {
      res.status(404).json({ message: 'No interest found with this id!' });
      return;
    };

    const userId = req.body.users;
    const interestId = req.params.id;
    req.session.save(() => {
      req.session.user_id = userId;
      req.session.logged_in = true;
    });

    if (req.body.users.length) {

      const userInterestData = {
        interest_id: interestId,
        user_id: userId
      }
      await UserInterest.create(userInterestData);
    }

    res.status(200).json(interestData);
  } catch (err) {
    res.status(500).json(err);
  };
});

//Remove an interest from a user
router.delete('/:id/remove', withAuth, async (req, res) => {
  try {
    const interestId = req.params.id;
    const userId = req.body.users;

    req.session.save(() => {
      req.session.user_id = userId;
      req.session.logged_in = true;
    });

    const userInterestData = await UserInterest.destroy({
      where: {
        interest_id: interestId,
        user_id: userId
        // user_id: req.session.user_id,
      },
    });

    res.status(200).json(userInterestData);
  } catch (err) {
    res.status(500).json(err);
  };
});

//delete an interest
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const interestData = await Interest.destroy({
      where: {
        id: req.params.id,
        // user_id: req.session.user_id,
      },
    });

    if (!interestData) {
      res.status(404).json({ message: 'No interest found with this id!' });
      return;
    };

    res.status(200).json(interestData);
  } catch (err) {
    res.status(500).json(err);
  };
});

module.exports = router;
