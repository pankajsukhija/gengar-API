const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { showService } = require('../services');
const pick = require('../utils/pick');
const User = require('../models/user.model') //////////////////

const addShow = catchAsync(async (req, res) => {
    console.log(req.body);
    const show = await showService.addShow(req.body);
    res.status(httpStatus.CREATED).send(show);
});

const getShows = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'genre']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    // options.populate = 'usersWatching' // adds populate to paginate options object 
    // doesn't work and message: Cast to ObjectId failed for value "" at path "_id" for model "User"
    
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

module.exports = {
    addShow,
    getShows,
    getShowById,
    deleteShow,
    updateShowById
  };