const express = require('express');
const auth = require('../../middlewares/auth');
const commentController = require('../../controllers/comment.controller');

const router = express.Router();

// Comments are added within shows
// Go to show.routes

router
  .route('/')
  .get(() => "// Comments are added within shows")

module.exports = router;