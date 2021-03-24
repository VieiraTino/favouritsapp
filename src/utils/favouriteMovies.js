const Movie = require('../models/movie');


const getMovies = async (favourite) => {

    let moviesInfo = [];
    
    for (const favouriteItem of favourite) {
        let movie = await Movie.findOne({_id: favouriteItem.myBdId});
        
        movie._doc['userMovieName'] = 'teste';

        moviesInfo.push(movie)
    }

    return moviesInfo;
}

module.exports = getMovies;