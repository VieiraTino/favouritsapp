const Movie = require('../models/movie');


const getMovies = async (favourites) => {

    let moviesInfo = [];

    for (const favouriteItem of favourites) {
        let movie = await Movie.findOne({ _id: favouriteItem.myBdId });

        movieInfo = { userMovieName: favouriteItem.userMovieName, ...movie._doc }

        moviesInfo.push(movieInfo)
    }

    return moviesInfo;
}

module.exports = getMovies;