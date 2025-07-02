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
  }

}, 
{ 
    timestamps: true
});

blogSchema.pre("validate", function(next) {
    if (!this.title && !this.body && !this.images) {
        next(new Error("Blog must have either a Title or Body or Images"));
    } else {
        next();
    }
})

module.exports = mongoose.model("Blog", blogSchema);