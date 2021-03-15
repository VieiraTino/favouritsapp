const mongoose = require('mongoose');
const { schema } = require('./user');

const validator = require('validator'); // ?????????

const favouriteSchema = new mongoose.Schema(
    {
        movie: {
            type: String,
            required: true,
            trim: true
        },
        idOnTMDB: {
            type: Number,
            required: true,
            unique: true,
            trim: true
        },
        owner: {
            type: String,
            required: true,
            ref: 'User'
        }
    }, 
    {
        timestamps: true
    }
);

const Favourite = mongoose.model('Favourite', favouriteSchema);

module.exports = Favourite;