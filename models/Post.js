const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    profile: {
      type: Schema.Types.ObjectId,
      ref: 'profiles',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    likes: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
  },
  { timestamps: {} }
);

const postSchema = new Schema(
  {
    poster: {
      //check profiles model to find id
      type: Schema.Types.ObjectId,
      ref: 'profiles',
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    author: String,
    skillLevel: {
      type: String,
      //enum gives an array of strings that will only be allowed
      enum: [
        'Beginner',
        'Intermediate',
        'Advanced',
        'Associate',
        'Junior',
        'Senior',
        'Lead',
      ],
    },
    cohort: String,
    title: {
      type: String,
      required: true,
    },
    categories: {
      type: [String],
      default: [],
    },
    summary: String,
    link: String,
    resourceType: {
      type: String,
      enum: [
        'Other',
        'Article',
        'Video',
        'Book',
        'Slideshow',
        'eBook',
        'podcast',
      ],
    },
    publishedAt: Date,
    videoLength: Number,
    timeToComplete: Number,
    comments: { type: [commentSchema], default: [] },
    // TODO rating - 1 to 5 rating scale
    // rating is an array of user objects that contains user(objectId) and rating
    rating: {
      type: [
        {
          user: {
            type: Schema.Types.ObjectId,
            required: true,
          },
          rating: Number,
        },
      ],
      default: [],
    },
    // TODO archive
    // TODO feature
  },
  { timestamps: {} }
);

module.exports = Post = mongoose.model('posts', postSchema);
