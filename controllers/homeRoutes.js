const router = require('express').Router();
const { Interest, User, Meetup, UserInterest, UserMeetup } = require('../models');
const withAuth = require('../utils/auth');
const multer = require('multer');
const path = require('path');

// Set up storage for multer
const storage = multer.diskStorage({
  destination: './public/upload', 
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize multer
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    cb(null, true);
  },
  limits: { fileSize: 5000000 }
}).single('myImage');

// Render homepage
router.get('/', async (req, res) => {
  try {
    res.render('homepage', {
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Render profile page
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Interest, through: UserInterest }, { model: Meetup, through: UserMeetup },
      ],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      user_id: req.session.user_id,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Handle image upload in the profile route
router.post('/profile/upload', withAuth, (req, res) => {
  upload(req, res, async (err) => {
    try {
      if (err) {
        return res.render('profile', { msg: err }); 
      }

      if (req.file == undefined) {
        return res.render('profile', { msg: 'No file selected' });
      }

      const filePath = `/upload/${req.file.filename}`;

      await User.update({ photo: filePath }, { where: { id: req.session.user_id } });

      return res.redirect('/profile');
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});

// login
router.get('/login', (req, res) => {
  // If the user is already logged in, redirect them to homepage 
  if (req.session.logged_in) {
    res.redirect('/homepage');
    return;
  }

  res.render('login');
});

//signup
router.get('/signup', (req, res) => {
  try {
    res.render('signup');
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;