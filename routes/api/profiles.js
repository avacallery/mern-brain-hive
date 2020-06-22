const express = require('express');
const router = express.Router();
const isEmpty = require('../../utilities/isEmpty');

const Profile = require('../../models/Profile');

// @route    POST api/profiles/
// @desc     create new profile
// @access   Public

router.post('/', async (req, res) => {
  try {
    const profileData = {
      user: req.body.user,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      name: req.body.name,
    };

    const profile = await Profile.create(profileData);

    return res.json(profile);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

module.exports = router;
