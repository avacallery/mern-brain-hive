const express = require('express');
const router = express.Router();
//when we use () after a function, we are executing express.Router() and creating an instance aka const router
//this isn't the root directory so we bring in router

// @route    POST api/users/
// @desc     create new user
// @access   Public

router.post('/', (req, res) => {
  res.json({ body: res.body });
});

module.exports = router;