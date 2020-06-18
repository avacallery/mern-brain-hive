const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    githubUrl: {
      type: String,
    },
    twitterUrl: {
      type: String,
    },
    bio: {
      type: String,
      required: true,
    },
    lastLogin: Date,
  },
  //timestamps(updated at and created at) will track changes to data
  //mongoose will handle the timestamps
  { timestamps: {} }
);

module.exports = User = mongoose.model('profiles', profileSchema);
