const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();

// @route    POST api/users/
// @desc     create new user
// @access   Public

router.post(
  '/',
  [check('email', 'Email is required').not().isEmpty()],
  (req, res) => {
    res.json({ body: req.body });
  }
);

module.exports = router;
