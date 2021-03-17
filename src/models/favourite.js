const mongoose = require('mongoose');
const { schema } = require('./user');

const validator = require('validator'); // ?????????

const favouriteSchema = new mongoose.Schema(
    {
        userMovieName: {
            type: String,
            required: true,
            trim: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        myBdId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Movie'
        }
    }, 
    {
        timestamps: true
    }
);

const Favourite = mongoose.model('Favourite', favouriteSchema);

module.exports = Favourite;