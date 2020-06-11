const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    lastLogin: Date,
  },
  //timestamps(updated at and created at) will track changes to data
  //mongoose will handle the timestamps
  { timestamps: {} }
);

module.exports = User = mongoose.model('users', userSchema);
