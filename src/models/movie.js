const mongoose = require('mongoose');
const { schema } = require('./favourite');

const validator = require('validator'); // ?????????

const movieSchema = new mongoose.Schema(
    {
        idOnTMDB: {
            type: Number,
            required: true,
            unique: true,
            trim: true
        },
        tmdbData: {
            type: Object,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;