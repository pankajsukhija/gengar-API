const mongoose = require('mongoose');

const commentSchema = mongoose.Schema(
    {
        showID: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' },
        userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content : {type : String, rrequired: true, },
    },
    {
        timestamps: true,
    }    
)

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;