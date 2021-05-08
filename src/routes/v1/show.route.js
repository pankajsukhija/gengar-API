const express = require('express');
const auth = require('../../middlewares/auth');
const showController = require('../../controllers/show.controller');

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

module.exports = router;