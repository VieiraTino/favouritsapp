const request = require('request');

const localMovieInfo = (param, callback) => {

    const url = "https://my-movie-favourites.herokuapp.com/api/movies/" + param;

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Não foi possível ligar à API', undefined);
        } else {
            callback(undefined, body);
        }
    })
}

module.exports = localMovieInfo;