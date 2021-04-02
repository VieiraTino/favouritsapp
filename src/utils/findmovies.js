const request = require('request');

const findmovies = (movie, callback) => {
    const url = 'https://api.themoviedb.org/3/search/movie?api_key=' + process.env.tmdb_api_key + '&query=' + movie;

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Não foi possível ligar à API', undefined);
        } else if (body.results.length === 0) {
            callback("Não foi possível encontrar resultados para o filme '" + movie + "'.", undefined);
        } else {
            const response = [];

            body.results.forEach((movie) => {
                response.push({
                    movie: movie.original_title,
                    idOnTMDB: movie.id,
                    poster: "https://www.themoviedb.org/t/p/w1280" + movie.poster_path
                });
            });

            callback(undefined, response);
        }
    })
}

// const movieSearch = (movie) => {
//     response.push({movie.poster_path, movie.imdb_id, movie.original_title })
// }


// obj.poster_path + obj.imdb_id + obj.original_title
// poster https://www.themoviedb.org/t/p/w1280/XWz5SS5g5mrNEZjv3FiGhqCMOQ.jpg

module.exports = findmovies;