const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const isEmpty = require('../../utilities/isEmpty');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');
const config = require('config');

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

// @route    PUT api/users/
// @desc     Login route
// @access   Public

router.put(
  '/',
  [
    check('email', 'Email required').not().isEmpty(),
    check('email', 'Valid email required').isEmail(),
    check('password', 'Password required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //we need try/catch because this is an async call to our database
    try {
      const user = await User.findOne({ email: req.body.email });

      if (isEmpty(user)) {
        return res.status(404).json({ errors: { msg: 'User not found.' } });
      }

      const isMatch = await bcrypt.compare(req.body.password, user.password);

      if (!isMatch) {
        return res
          .status(403)
          .json({ errors: { message: 'invalid password' } });
      }

      const payload = {
        user: {
          id: user.id,
          email: user.email,
        },
      };

      jwt.sign(payload, config.get('jwtToken'), (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    }
  }
);

module.exports = router;
