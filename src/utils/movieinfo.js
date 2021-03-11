const request = require('request');

const movieinfo = (id, callback) => {
    const url = "https://api.themoviedb.org/3/movie/" + id + "?api_key=7b481481d5ec43fb9100bd149b893bd8";

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Não foi possível ligar à API', undefined);
        } else {
            callback(undefined, body);
        }
    })
}

module.exports = movieinfo;