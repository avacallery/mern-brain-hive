const express = require('express');
const router = express.Router();
const Joi = require('joi');
//when we use () after a function, we are executing express.Router() and creating an instance aka const router
//this isn't the root directory so we bring in router

// @route    POST api/users/
// @desc     create new user
// @access   Public

router.post('/', (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  res.send(user);
});

//create branch with validation
//validate the body of the request
//must have email and password
//email must be valid
//password must have at least 6 characters

function validateUser(user) {
  const schema = {
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  };
  return Joi.validate(user, schema);
}

module.exports = router;
