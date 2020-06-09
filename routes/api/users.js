const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const isEmpty = require('../../utilities/isEmpty');
const bcrypt = require('bcryptjs');

//models
const User = require('../../models/User');

// @route    POST api/users/
// @desc     create new user
// @access   Public

router.post(
  '/',
  [
    check('email', 'Email required').not().isEmpty(),
    check('email', 'Valid email required').isEmail(),
    check('password', 'Password must contain at least 6 characters').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const userData = {
        email: req.body.email,
        password: req.body.password,
      };

      //we need to hash the password before we send to the database
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);

      //.create saves one or more documents to the database
      const user = await User.create(userData);
      return res.json(user);
    } catch (error) {
      console.error(error);
      return res.status(500);
    }
  }
);

module.exports = router;
