const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const User = require('./user.model') // THIS IS REALLY REALLY IMPORTANT
// WASTED WHOLE DAY ON THIS
// Else array ObjectId reference will not work
const Comment = require('./comment.model')


const showSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        genre: {
            type: String,
            default: 'unknown',
        },
        thumbnailURL : {
            type : String
        },
        plot : String,
        usersWatching : [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // make sure to import user model
        comments : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    },
    {
        timestamps: true,
    }    
)

// add plugin that converts mongoose to json
// showSchema.plugin(toJSON);
showSchema.plugin(paginate);

const Show = mongoose.model('Show', showSchema);

module.exports = Show;