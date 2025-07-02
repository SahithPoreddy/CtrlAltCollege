const mongoose = require('mongoose');

const blogVoteSchema = new mongoose.Schema({
  blog_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: true
  },

  vote_by: {
    type: String, // "[deleted]" if voter deletes their account
    required: true
  },

  vote_type: {
    type: String,
    enum: ['upvote', 'downvote'],
    required: true
  }

},
{
    timestamps: true
});

module.exports = mongoose.model('Vote', blogVoteSchema);
