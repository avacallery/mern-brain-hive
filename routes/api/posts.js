const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

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
      'Beginner',
      'Intermediate',
      'Advanced',
      'Associate',
      'Junior',
      'Senior',
      'Lead',
    ]),
    check('summary', 'Summary is required').notEmpty(),
    check('link', 'Need link').notEmpty(),
    check('link', 'Valid URL required').isURL(),
    check('resourceType', 'Need resource type').notEmpty(),
    check('resourceType', 'Select from dropdown').isIn([
      'Other',
      'Article',
      'Video',
      'Book',
      'Slideshow',
      'eBook',
      'podcast',
    ]),
    check('publishedAt', 'Date of resource required').optional().isISO8601(),
    check('videoLength', 'Round video length to closest minute')
      .optional()
      .isNumeric()
      .isInt(),
    check('timeToComplete', 'Round complete time to closest minute')
      .optional()
      .isNumeric(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // store postData in variable
      const postData = req.body;
      console.log(postData);
      // get profile matching userId using req.user.id
      const profile = await Profile.findOne({ user: req.user.id });
      console.log(profile);
      // add profileId to postData
      postData.poster = profile.id;
      // create the post in the database
      // postData we have updated with our id
      // const post = await Post.create(postData);
      return res.json(await Post.create(postData));
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    }
  }
);

// Post model -> post to the Post model in db
// return the new Post to the frontend

module.exports = router;
