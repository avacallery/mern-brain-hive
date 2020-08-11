const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');

// @route   POST api/posts/:postId/comments
// @desc    Create a new comment
// @access  Private

router.post('/', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      res.status(400).json({ message: 'Profile required to add comments.' });
    }

    const comment = {
      profile: profile._id,
      content: req.body.content,
    };
    //$push Mongoose command to add to an array,
    // in this case, pushing to the comments array in the Post schema
    const post = await findByIdAndUpdate(
      req.params.postID,
      {
        $push: { comments: comment },
      },
      { new: true }
    );

    const post = await Post.findById(req.params.postID);
    if (!post) {
      res.status(404).json({ message: 'Post not found.' });
    }

    res.json(post.comments);
  } catch (error) {
    res.status(500).json(error);
  }
});
module.exports = router;
