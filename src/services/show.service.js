const { Show, User } = require('../models');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
// const { mongoose } = require('../config/config');

/**
 * Add a new show
 * @param {Object} showBody
 * @returns {Promise<Show>}
 */
const addShow = async (showBody) => {
    const show = await Show.create(showBody);
    return show;
};


/**
 * Query for shows
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getShows = async (filter, options) => {
    const shows = await Show.paginate(filter, options) // populate is passed in options through controller
    return shows
}

/**
 * Get show by id
 * @param {ObjectId} id
 * @returns {Promise<Show>}
 */
const getShowById = async (id) => {
    // https://mongoosejs.com/docs/populate.html
    // Life saver - https://stackoverflow.com/questions/57256207/mongoose-populating-a-nested-array-of-ids
    show = await Show.findById(id)
    if (!show) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Show not found');
    }
    //console.log(show)
    await show.populate('usersWatching', 'name').execPopulate()
    await show.populate('comments').execPopulate()
    await show.populate('comments.userID', 'name').execPopulate()
    return show;
};


/**
 * Delete show by id
 * @param {ObjectId} showID
 * @returns {Promise<Show>}
 */
 const deleteShowById = async (showID) => {
    const show = await getShowById(showID); // i know this will cause show to populate first unnecessarily
    if (!show) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Show not found');
    }
    await show.remove();
    return show;
};


/**
 * Update user by id
 * @param {ObjectId} showID
 * @param {Object} updateBody
 * @returns {Promise<Show>}
 */
const updateShowById = async (showID, updateBody) => {
    const show = await getShowById(showID);
    if (!show) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Show not found');
    }
    Object.assign(show, updateBody);
    await show.save();
    return show;
};

const addShowToWatchlist = async (showID, userID) => {
    alreadyInList = await Show.find({_id : showID, usersWatching : userID})
    if (alreadyInList[0]){
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Already in watchlist');
    }
    // new : true as option should be passes to return updated doc
    updatedShow = await Show.findByIdAndUpdate(showID, {$push : {usersWatching : userID}},
        {new: true})
    updatedUser = await User.findByIdAndUpdate(userID, {$push : {watchList : showID}},
        {new: true})
    const populatedWithComments = await updatedShow.populate('comments').execPopulate()
    const populatedShow = await populatedWithComments.populate('usersWatching ', 'name').execPopulate()
    return populatedShow
};

const removeShowFromWatchlist = async (showID, userID) => {
    alreadyInList = await Show.find({_id : showID, usersWatching : userID})
    if (!alreadyInList[0]){
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You cannot erase what never existed');
    }
    updatedShow = await Show.findByIdAndUpdate(showID, {$pull : {usersWatching : userID}},
        {new: true})
    updatedUser = await User.findByIdAndUpdate(userID, {$pull : {watchList : showID}},
        {new: true})
    const populatedWithComments = await updatedShow.populate('comments').execPopulate()
    const populatedShow = await populatedWithComments.populate('usersWatching ', 'name').execPopulate()
    return populatedShow
}

module.exports = {
    addShow,
    getShowById,
    getShows,
    deleteShowById,
    updateShowById,
    addShowToWatchlist,
    removeShowFromWatchlist
}