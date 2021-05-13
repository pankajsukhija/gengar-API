const express = require('express');
const auth = require('../../middlewares/auth');
const showController = require('../../controllers/show.controller');
const commentController = require('../../controllers/comment.controller');

const router = express.Router();

router
  .route('/')
  .get(showController.getShows);

router
  .route('/addShow')
  .post(auth('manageShows'), showController.addShow)

router
  .route('/:showID')
  .get(showController.getShowById)
  .delete(auth('manageShows'), showController.deleteShow)
  .patch(auth('manageShows'), showController.updateShowById)

router
  .route('/:showID/addToWatch')
  .post(auth('manageShows'), showController.addShowToWatchlist)
  .delete(auth('manageShows'), showController.removeShowFromWatchlist)


  // Passed to Comment Controller
router
  .route('/:showID/addComment')
  .post(auth('canComment'), commentController.addComment)

router
  .route('/:showID/:commentID')
  .delete(auth('canComment'), commentController.deleteCommentByID)


module.exports = router;