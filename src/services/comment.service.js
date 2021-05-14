const httpStatus = require('http-status');
const { Comment, Show, User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a comment
 * @param {ObjectId} commentID
 * @param {ObjectId} userID
 * @param {String} content
 * @returns {Promise<Show>}
 */
const addComment = async (showID, userID, content ) => {
  commentData = {showID, userID, content}
  const comment = await Comment.create(commentData);
  updatedShow = await Show.findByIdAndUpdate(showID, {$push : {comments : comment._id}},
    {new: true}).populate("comments")
  await updatedShow.populate("comments.userID", "name").execPopulate()
  updatedUser = await User.findByIdAndUpdate(userID, {$push : {comments : comment._id}},
    {new: true})
  const populatedShow = await updatedShow.populate('usersWatching ', 'name').execPopulate()
  return populatedShow
};


/**
 * Delete comment by id 
 * User ID from authroization header is required to validate
 * @param {ObjectId} commentID
 * @param {ObjectId} userID
 * @returns {Promise<Comment>}
 */
const deleteCommentById = async (commentID, showID, userID) => {
  // So that only authorized user can deleted his own comment
  await Comment.findOneAndDelete({ _id : commentID, userID : userID})
  updatedShow = await Show.findByIdAndUpdate(showID, {$pull : {comments : commentID}},
    {new: true}).populate("comments")
  updatedShow.populate("comments.userID", "name").execPopulate()
  updatedUser = await User.findByIdAndUpdate(userID, {$pull : {comments : commentID}},
    {new: true})
  const populatedShow = await updatedShow.populate('usersWatching ', 'name').execPopulate()
  return populatedShow
};

module.exports = {
  addComment,
  deleteCommentById
};
