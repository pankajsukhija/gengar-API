const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { showService } = require('../services');
const pick = require('../utils/pick');
const User = require('../models/user.model')
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const addShow = catchAsync(async (req, res) => {
    console.log(req.body);
    const show = await showService.addShow(req.body);
    res.status(httpStatus.CREATED).send(show);
});

const getShows = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'genre']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    options.populate = 'comments.userID, usersID.name' // adds populate to paginate options object 
    // usersWatching doesn't work and message: Cast to ObjectId failed for value "" at path "_id" for model "User"
    // Leaving it as it is
    // Don't want to mess with the paginate plugin included in boilerplate.

    const result = await showService.getShows(filter, options);
    res.send(result);
})

const getShowById = catchAsync(async (req, res) => {
    const show = await showService.getShowById(req.params.showID);
    if (!show) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No show available by this ID');
    }
    res.send(show);
})

const deleteShow = catchAsync(async (req, res) => {
    await showService.deleteShowById(req.params.showID);
    res.status(httpStatus.NO_CONTENT).send();
});

const updateShowById = catchAsync(async (req, res) => {
    const show = await showService.updateShowById(req.params.showID, req.body);
    res.send(show);
});

const addShowToWatchlist = catchAsync(async (req, res) => {
    const accessToken = req.headers.authorization.split(" ")[1]
    const userID = jwt.verify(accessToken, config.jwt.secret).sub; // get userID from payload
    const result = await showService.addShowToWatchlist(req.params.showID, userID)
    res.send(result)
});

const removeShowFromWatchlist = catchAsync(async (req, res) => {
    const accessToken = req.headers.authorization.split(" ")[1]
    const userID = jwt.verify(accessToken, config.jwt.secret).sub; // get userID from payload
    const result = await showService.removeShowFromWatchlist(req.params.showID, userID)
    res.send(result)
})

module.exports = {
    addShow,
    getShows,
    getShowById,
    deleteShow,
    updateShowById,
    addShowToWatchlist,
    removeShowFromWatchlist
  };