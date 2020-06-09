const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const isEmpty = require('../../utilities/isEmpty');

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
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.json({ body: req.body });
  }
);

module.exports = router;
