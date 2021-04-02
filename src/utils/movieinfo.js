const request = require('request');

const movieinfo = (id, callback) => {
    const url = "https://api.themoviedb.org/3/movie/" + id + "?api_key=" + process.env.tmdb_api_key;

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Não foi possível ligar à API do TMDB', undefined);
        } else {

            const result = {
                original_title: body.original_title,
                sinopse: body.overview,
                homepage: body.homepage,
                poster_path: "https://www.themoviedb.org/t/p/w1280" + body.poster_path,
                release_date: body.release_date,
                vote_average: body.vote_average,
                vote_count: body.vote_count
            }

            callback(undefined, result);
        }
    })
}

module.exports = movieinfo;