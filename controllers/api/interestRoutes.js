const router = require('express').Router();
const { Interest, User, UserInterest } = require('../../models');
const withAuth = require('../../utils/auth');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: './public/upload/interests', 
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    cb(null, true);
  },
  limits: { fileSize: 5000000 }
}).single('interest');

//Get all interest
// router.get('/', withAuth, async (req, res) => {
//   try {
//     const interestData = await Interest.findAll();

//     const interests = interestData.map((interest) => interest.get({ plain: true }));
//     // res.status(200).json(interestData);
//     console.log(interests);
//     res.render('interests', {
//       interests,
//       logged_in: req.session.logged_in
//     });
//   } catch (err) {
//     res.status(500).json(err);
//   };
// });

// // router for rendering the page to create a new interest 
// router.get('/createInterest', (req, res) => {
//   res.render('createInterest');
// });

//Get all interest
router.get('/', withAuth, async (req, res) => {
  try {
    const interestData = await Interest.findAll(
      {
      include: [
        {
          model: User,
          through: UserInterest,
          attributes: {
            exclude: ['password']
          },
        },
      ],
    }
    );
    console.log(interestData);

    const interests = interestData.map((interest) => {

      interest.get({ plain: true });
      console.log(interest.users);
      if (req.session.user_id) {
        interest.userHasInterest = interest.users.some(user => user.dataValues.id == req.session.user_id);
      }
      return interest;
      console.log(interest);
    });
    // res.status(200).json(interestData);
    console.log(interests);
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

    if (req.session.user_id) {
      interest.userHasInterest = interest.users.some(user => user.id == req.session.user_id);
    }
    console.log(interest);
    console.log(req.session.user_id);

    res.render('oneInterest', {
      interest,
      logged_in: req.session.logged_in
    });
    // res.status(200).json(interestData);
  } catch (err) {
    res.status(500).json(err);
  };
});

// Create new interest with/out image
router.post('/', withAuth, async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      // Check if a file is selected
      if (req.file) {
        req.body.photo = `/upload/interests/${req.file.filename}`;
      }

      const interestData = await Interest.create(req.body);

      req.session.save(() => {
        req.session.interest_id = interestData.id;
        req.session.logged_in = true;
      });

      res.status(200).json(interestData);
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
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
      console.log(userInterestData);

      const newUserInterest = await Interest.findByPk(req.params.id, {
        include: [
          {
            model: User,
            through: UserInterest,
          },
        ],
      });
      console.log(newUserInterest);

      if (!newUserInterest) {
        res.status(404).json({ message: 'No interest found with this id!' });
        return;
      };

      const interest = newUserInterest.get({ plain: true });
      res.render('oneInterest', {
        where: {
          interestId: req.params.id
        },
        interest,
        logged_in: req.session.logged_in
      })
    } else {
      res.status(200).json(interestData);
    }
  } catch (err) {
    console.log(err);
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
    console.log(err);
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
