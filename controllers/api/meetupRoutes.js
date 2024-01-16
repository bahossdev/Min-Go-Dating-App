const router = require('express').Router();
const { Meetup, User, UserMeetup } = require('../../models');
const withAuth = require('../../utils/auth');

// get all meetups
router.get('/', async (req, res) => {
    try {
        const meetupData = await Meetup.findAll()
        const meetups = meetupData.map((meetup) => meetup.get({ plain: true }));
        res.render('meetups', {
            meetups,
            logged_in: req.session.logged_in
        });
        // res.status(200).json(meetupData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// get one meetup by id
router.get('/:id', withAuth, async (req, res) => {
    try {
        const meetupData = await Meetup.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    through: UserMeetup,
                    attributes: {
                        exclude: ['password']
                    },
                },
            ],
        });

        if (!meetupData) {
            res.status(404).json({ message: 'No events found with this id!' });
            return;
        };

        const meetup = meetupData.get({ plain: true });
        if (req.session.user_id) {
            meetup.userJoined = meetup.users.some(user => user.id == req.session.user_id);
          }
        console.log(meetup);
        res.render('oneMeetup', {
            meetup,
            logged_in: req.session.logged_in
        });
        // res.status(200).json(meetupData);
    } catch (err) {
        res.status(500).json(err);
    };
});

// create new meetup
router.post('/', withAuth, async (req, res) => {
    try {
        const meetupData = await Meetup.create(req.body);
        const userId = req.body.users;
        const meetupId = meetupData.dataValues.id;

        req.session.save(() => {
            req.session.user_id = userId;
            req.session.logged_in = true;
        });

        if (req.body.users.length) {

            const userMeetupData = {
                meetup_id: meetupId,
                user_id: userId
            }
            await UserMeetup.create(userMeetupData);
        }

        res.status(200).json(meetupData);
    } catch (err) {
        res.status(400).json(err);
    };
});

// update a meetup
router.put('/:id', withAuth, async (req, res) => {
    try {
        const meetupData = await Meetup.update(req.body, {
            where: {
                id: req.params.id,
                // user_id: req.session.user_id,
            },
        });

        if (!meetupData) {
            res.status(400).json({ message: "No meetup found with this information" })
        };
       
    const userId = req.body.users;
    const meetupId = req.params.id;
    req.session.save(() => {
      req.session.user_id = userId;
      req.session.logged_in = true;
    });

    if (req.body.users.length) {

      const userMeetupData = {
        meetup_id: meetupId,
        user_id: userId
      }
      await UserMeetup.create(userMeetupData);
      console.log(userMeetupData);

      const newUserMeetup = await Meetup.findByPk(req.params.id, {
        include: [
          {
            model: User,
            through: UserMeetup,
          },
        ],
      });
      console.log(newUserMeetup);

      if (!newUserMeetup) {
        res.status(404).json({ message: 'No meetup found with this id!' });
        return;
      };

      const meetup = newUserMeetup.get({ plain: true });
      res.render('oneMeetup', {
        where: {
          meetupId: req.params.id
        },
        meetup,
        logged_in: req.session.logged_in
      })
    } else {
      res.status(200).json(meetupData);
    }
    } catch (err) {
        res.status(500).json(err)
    };
});

//Remove an meetup from a user
router.delete('/:id/remove', withAuth, async (req, res) => {
    try {
      const meetupId = req.params.id;
      const userId = req.body.users;
  
      req.session.save(() => {
        req.session.user_id = userId;
        req.session.logged_in = true;
      });
  
      const userMeetupData = await UserMeetup.destroy({
        where: {
          meetup_id: meetupId,
          user_id: userId
          // user_id: req.session.user_id,
        },
      });
  
      res.status(200).json(userMeetupData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    };
  });

// delete a meetup
router.delete('/:id', withAuth, async (req, res) => {
    // delete one meetup by its `id` value
    try {
        const meetupData = await Meetup.destroy({
            where: {
                id: req.params.id,
                // user_id: req.session.user_id,

            }
        });
        if (!meetupData) {
            res.status(404).json({ message: 'No meetup found with this information' });
            return;
        }
        res.status(200).json(meetupData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
