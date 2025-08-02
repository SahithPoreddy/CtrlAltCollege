const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    default: null
  },

  body: {
    type: String,
    default: null
  },

  images: {
    type: [String],
    default: null
  },

  created_by: {
    type: String,
    required: true // "[deleted]" if creator deletes their account
  },

  upvote_count: {
    type: Number,
    default: 0
  },

  downvote_count: {
    type: Number,
    default: 0
  },

  comment_count: {
    type: Number,
    default: 0
  },
  
  isDeleted: {
    type: Boolean,
    default: false
  }

}, 
{ 
    timestamps: true
});

module.exports = mongoose.model("Blog", blogSchema);