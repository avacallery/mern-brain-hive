const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const isEmpty = require('../../utilities/isEmpty');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');

// @route    GET api/profiles/
// @desc     Read profile
// @access   Public

// router.get('/', auth, (req, res) => {
//   console.log(req.user);
//   res.json({ message: 'test route' });
// });

// @route    POST api/profiles/
// @desc     create new profile for logged in user
// @access   Private

router.post(
  '/',
  auth,
  [
    check('firstName', 'First name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('githubUrl', 'Valid URL required').optional().isURL(),
    check('twitterUrl', 'Valid URL required').optional().isURL(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const {
        firstName,
        lastName,
        bio,
        city,
        state,
        githubUrl,
        twitterUrl,
      } = req.body;

      const userId = req.user.id;

      // Build profile object
      //trim() sends back of the modify version of the copy
      const profileFields = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name: `${firstName.trim()} ${lastName.trim()}`,
        //you can access characters of a string like an array
        // initials: `${firstName[0]}${lastName[0]}`,
      };

      profileFields.name = `${profileFields.firstName} ${profileFields.lastName}`;
      profileFields.user = userId;
      if (bio) profileFields.bio = bio;
      if (city) profileFields.city = city;
      if (state) profileFields.state = state;

      // Build social object
      profileFields.social = {};
      if (githubUrl) profileFields.social.githubUrl = githubUrl;
      if (twitterUrl) profileFields.social.twitterUrl = twitterUrl;

      try {
        let profile = await Profile.findById(userId);

        if (!isEmpty(profile)) {
          //Update
          profile = await Profile.findByIdAndUpdate(
            userId,
            { $set: profileFields },
            { new: true }
          );
          return res.json(profile);
        }
        //Create
        profile = await Profile.create(profileFields);
        res.json(profile);
      } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// @route    GET api/profiles/:id
// @desc     Get logged in users profile
// @access   Private

router.get('/:id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    console.log(profile);
    res.json(profile);
  } catch (error) {
    console.error(err.message);
    s;
    res.status(500).send('Server Error');
  }
});

// @route    GET api/profiles
// @desc     Get all profiles - 1. do not send city and state and 2. do not include logged in user in results
// @access   Private

router.get('/', auth, async (req, res) => {
  try {
    const profiles = await Profile.find(
      { users: req.user.ids },
      { city: 0, state: 0 }
    );

    if (!profiles) {
      return res.status(400).json({ msg: 'Cannot access profiles.' });
    }

    console.log(profiles);
    res.json(profiles);
  } catch (error) {
    console.error(err.message);
    s;
    res.status(500).send('Server Error');
  }
});

//mongo has something called PROJECTION  (1) and  (2) queries
module.exports = router;
