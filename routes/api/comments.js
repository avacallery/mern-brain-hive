const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');

// @route   POST api/posts/:postId/comments
// @desc    Create a new comment
// @access  Private

// epic: add a comment to a post and return updated comments array

// ensure user logged in
// find post by the postId
// get/verify User Profile
// get the comment from the request
// build comment object (get profileId through userId)
// add the comment to the post
// return comments array

router.post('/:postId/comments', auth, async (req, res) => {});

module.exports = router;
