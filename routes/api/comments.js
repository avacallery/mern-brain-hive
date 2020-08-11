const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');

// @route   POST api/posts/:postId/comments
// @desc    Create a new comment
// @access  Private

router.post('/comments', auth, async (req, res) => {
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
      req.params.postId,
      {
        $push: { comments: comment },
      },
      { new: true }
    );

    if (!post) {
      res.status(404).json({ message: 'Post not found.' });
    }

    res.json(post.comments);
  } catch (error) {
    res.status(500).json(error);
  }
});

// comments get an id because they are subdocuments

// @route   DELETE api/posts/:postId/comments/:commentID
// @desc    Delete a comment
// @access  Owner

router.delete('/:postId/:commentId', auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.postId);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
    }

    const commentIndex = post.comments.findIndex((comment) => {
      return comment._id === req.params.commentId;
    });

    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Comment not found.' });
    }
    const profile = await Profile.findOne({ user: req.user.id });
    // if profile id not the owner of the comment
    if (post.comments[commentIndex].profile !== profile._id) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }

    post = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $pull: {
          comments: { _id: req.params.commentId },
          profile: profile._id,
        },
      },
      { new: true }
    );

    res.json(post.comments);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

module.exports = router;
