const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

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

// @route   POST api/posts
// @desc    Create a new post
// @access  Private

router.post(
  '/',
  auth,
  [
    check('author', 'Author is required').notEmpty(),
    check('title', 'Title is required').notEmpty(),
    check('skillLevel', 'Select from dropdown').isIn([
      'Other',
      'Article',
      'Video',
      'Book',
      'Slideshow',
      'eBook',
      'podcast',
    ]),
    check('summary', 'Summary is required').notEmpty(),
    check('link', 'Valid URL required').optional().isURL(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    return res.json(req.body);
  }
);

// resourceType -> string -> enum
// publishedAt -> date -> optional
// videoLength -> number -> optional
// timeToComplete -> number -> optional

// use express-validator to check if data is valid/right format
// Post model -> post to the Post model in db
// return the new Post to the frontend

module.exports = router;
