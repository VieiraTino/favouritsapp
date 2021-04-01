const request = require('request');

const localMovieInfo = (param, callback) => {

    const url = "http://localhost:3000/api/movies/" + param;

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Não foi possível ligar à API', undefined);
        } else {
            callback(undefined, body);
        }
    })
}

module.exports = localMovieInfo;