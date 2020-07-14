const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Post = require('../../models/Post');
const User = require('../../models/User');

// @route   GET api/posts/test
// @desc    Test Route
// @access  Public

// we use res.json because we are using an API to communicate
// express converts what we're sending (an object) into json syntax
// .send sends back HTML so when we're working with APIs, .json is recommended

router.get('/test', (req, res) => {
  res.json({ msg: 'Test' });
});

module.exports = router;
