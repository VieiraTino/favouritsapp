const request = require('request');

const findmovies = (movie, callback) => {
    const url = 'https://api.themoviedb.org/3/search/movie?api_key=7b481481d5ec43fb9100bd149b893bd8&query=' + movie

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Não foi possível ligar à API', undefined);
        } else if (body.results.length === 0) {
            callback("Não foi possível encontrar resultados para o filme '" + movie + "'.", undefined);
        } else {
            // recebo mais páginas aqui... reenviar tudo
            callback(undefined, body);
        }
    })
}

module.exports = findmovies;