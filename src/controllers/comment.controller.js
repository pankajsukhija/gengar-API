const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { commentService } = require('../services');
const Comment = require('../models/comment.model');
const jwt = require('jsonwebtoken');
const config = require('../config/config');



// updated Show document is send to user after commenting
const addComment = catchAsync(async (req, res) => {
    const accessToken = req.headers.authorization.split(" ")[1]
    const userID = jwt.verify(accessToken, config.jwt.secret).sub; // get userID from payload
    const updatedShowData = await commentService
    .addComment(req.params.showID, userID, req.body.content);
    res.status(httpStatus.CREATED).send(updatedShowData);
});

// INCOMPLETE FOR NOW??????????????
const deleteCommentByID = catchAsync(async (req, res) => {
    const accessToken = req.headers.authorization.split(" ")[1]
    const userID = jwt.verify(accessToken, config.jwt.secret).sub; // get userID from payload
    const updatedShowData = await commentService
    .deleteCommentById(req.params.commentID, req.params.showID, userID);
    res.send(updatedShowData);
});


module.exports = {
    addComment,
    deleteCommentByID
};