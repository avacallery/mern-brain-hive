const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const commentsRouter = require('./comments');

const auth = require('../../middleware/auth');
const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');

// @route   GET api/posts/test
// @desc    Test Route
// @access  Public

// we use res.json because we are using an API to communicate
// express converts what we're sending (an object) into json syntax
// .send sends back HTML so when we're working with APIs, .json is recommended

router.get('/test', (req, res) => {
  res.json({ msg: 'It works!' });
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

// @route   GET api/posts
// @desc    Get all posts
// @access  Public

// get and return to request all posts
//

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({ deleted: false }).populate(
      'poster',
      'avatar name'
    );
    res.json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

// @route   GET api/posts/:postId
// @desc    Get single post by id
// @access  Public

router.get('/:postId', async (req, res) => {
  try {
    // using req.params.id to access URL postId
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
      // .populate('poster', ['avatar', 'name', 'firstName']);
    }

    res.json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

// @route   PUT api/posts/:postId
// @desc    Update existing post
// @access  Owner

// get and update existing post
// find the post by id in the Post model
// confirm logged in user is the owner
// modify the data
// commit the changes to the database
// send the new data back to the requester

router.put('/:postId', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    console.log(profile._id);
    console.log(req.params.postId);

    // verify that the poster and the id match and update if they do match in one instance so nothing happens inbetween the updating (findOneAndUpdate)
    const post = await Post.findOneAndUpdate(
      {
        _id: req.params.postId,
        poster: profile._id,
      },
      req.body,
      // return new version
      { new: true }
    );

    if (!post) {
      const post = await Post.findById(req.params.postId);
      if (!post) {
        return res.status(404).json({ msg: 'Post not found.' });
      }
      return res.status(401).json({ msg: 'Access denied.' });
    }

    res.json(post);
  } catch (err) {
    console.error(error);
    return res.status(500).json(error);
  }
});

/* router.put('/:postId', auth, async (req, res) => {
   try {
    let post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found.' });
    }

    // pull profile._id from the Post (req.params.postId) which uses the Profile model
    const profile = await Profile.findById(post.poster);

    if (req.user.id !== profile.user) {
      return res.status(401).json({ msg: 'Access denied.' });
    }

    // find profile based on an id that it contains
    // const profile = await Profile.find({ user: req.user.id });
    // if (profile._id !== post.poster)

    // MODIFY the data
    const postData = { ...post, ...req.body };
    // anything that comes after the first spread operator (...) will override if the keys are the same
    // whatever is entered in req.body to create or update based on the keys in postData, which comes from the Post model

    // update with new post object
    await post.update(postData);
    res.json(post);
  } catch (err) {
    console.error(error);
    return res.status(500).json(error);
  }
}); */

// @route   DELETE api/posts/:postId
// @desc    Delete post by id --- Locking method
// @access  Owner

router.delete('/:id', auth, async (req, res) => {
  //confirm logged in user
  //find post
  //confirm the post is owned by the logged in user
  //delete the post
  //return success message
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found.' });
    }
    // make sure the profile that we pull matches the id of the user making the request
    const profile = await Profile.findById(post.poster);

    if (req.user.id != profile.user) {
      return res.status(401).json({ msg: 'Unauthorized.' });
    }

    await post.remove();
    res.json({ msg: 'Post removed. ' });
  } catch (err) {
    console.error(error);
    return res.status(500).json(error);
  }
});

// @route   DELETE api/posts/:postId
// @desc    Delete post by id ---- non-locking method
// @access  Owner

router.delete('/:id', auth, async (req, res) => {
  try {
    // we are using findOne because we want to find the user id, which is located within the Profile model
    const profile = await Profile.findOne({ user: req.user.id });
    // pull id from the poster
    // findOneAndDelete instead of findOneAndRemove so Mongo runs a legit delete
    // if we find one and delete, it will return the deleted document in result
    // if returns null, we have not deleted
    const result = await Post.findOneAndDelete({
      _id: req.params.id,
      poster: profile._id,
    });

    if (!result) {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }
      res.status(401).json({ msg: 'Unauthorized.' });
    }

    return res.json({ msg: 'Success ' });
  } catch (err) {
    console.error(error);
    res.status(500).json(error);
  }
});

// updating the post model by adding or removing a Like

// @route   PUT api/posts/:postId/like
// @desc    Add or remove a like from a post
// @access  Private

// epic: To pull a post and either add a like or remove an existing like from the user, return like count

// ensure logged in
// find post by id
// pull the task from the body (like/unlike)
// true/false and numbers are easier to send across bandwith or readability "liked" or "unliked" ?
// validate the body to make sure we have a task (like/unlike)
// if like
// // add the userId to the like set
// else unlike
// // remove userId from the set
// done
// // save updated post <- non-locking method (an atomic method)
// return the like count to the requester

// set is another kind of collection items (set of unique elements)
// mongoose uses collection system to create $addtoset -> if element is already there, it will not add

router.put(':/postId/like', auth, async (req, res) => {
  try {
    let post;
    if (req.body.like === true) {
      post = await Post.findByIdAndUpdate(
        req.params.postId,
        {
          $addToSet: { likes: req.user.id },
        },
        { new: true }
      );
    } else if (req.body.like === false) {
      post = await Post.findByIdAndUpdate(
        req.params.postId,
        {
          $pull: { likes: req.user.id },
        },
        { new: true }
      );
    }
    res.status(200).json({ likes: post.likes.length });
  } catch (err) {
    console.error('Error in /' + req.params.postId + '/like' + error.message);
    res.status(500).json(error);
  }
});

// create nested router
router.use('/:postId', commentsRouter);
// won't match our router because there's a second parameter that will come after /:postId

module.exports = router;
