const router = require('express').Router();
const { Meetup, User, UserMeetup } = require('../../models');
const withAuth = require('../../utils/auth');

// get all meetups
router.get('/', async (req, res) => {
    try {
        const meetupData = await Meetup.findAll({
            include: [
                {
                    model: User,
                    through: UserMeetup,
                    attributes: {
                        exclude: ['password']
                    },
                },
            ],
        })

        res.status(200).json(meetupData);
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

        res.status(200).json(meetupData);
    } catch (err) {
        res.status(500).json(err);
    };
});

// create new meetup
router.post('/', withAuth, async (req, res) => {
    try {
        const meetupData = await Meetup.create(req.body);


        // req.session.save(() => {
        //     req.session.user_id = meetupData.id;
        //     req.session.logged_in = true;

        // });
        res.status(200).json(meetupData);
    } catch (err) {
        res.status(400).json(err);
    };
});

// update a meetup
router.put('/:id', withAuth, async (req, res) => {
    // update meetup data
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
        res.status(200).json(meetupData)
    } catch (err) {
        res.status(500).json(err)
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
