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
    author: {
      type: String,
      required: true,
    },
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
      required: true,
    },
    cohort: String,
    title: {
      type: String,
      required: true,
    },
    categories: {
      type: [String],
      default: ['Other'],
    },
    summary: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
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
      required: true,
    },
    publishedAt: Date,
    videoLength: Number,
    timeToComplete: Number,
    comments: { type: [commentSchema], default: [] },
    likes: {
      type: [schema.Types.ObjectId],
      default: [],
    },
  },
  { timestamps: {} }
);

module.exports = Post = mongoose.model('posts', postSchema);
