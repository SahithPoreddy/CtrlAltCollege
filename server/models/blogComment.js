const mongoose = require('mongoose');

const blogCommentSchema = new mongoose.Schema({
  blog_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: true
  },

  isDeleted: {
    type: Boolean,
    default: false
  },
  
  comment_by: {
    type: String, // "[deleted]" if commenter deletes their account
    required: true
  },

  parent_comment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment", // null when comment is a top-level comment and not null when comment is a reply to another comment.
    default: null
  },

  text: {
    type: String,
    required: true
  }

},
{
    timestamps: true
});

module.exports = mongoose.model('Comment', blogCommentSchema);
