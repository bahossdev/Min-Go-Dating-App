const router = require('express').Router();
const userRoutes = require('./userRoutes');
const interestRoutes = require('./interestRoutes');
const meetupRoutes = require('./meetupRoutes');

router.use('/users', userRoutes);
router.use('/interests', interestRoutes );
router.use('/meetups', meetupRoutes );

module.exports = router;
