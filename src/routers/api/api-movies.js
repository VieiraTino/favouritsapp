const express = require('express');
const router = new express.Router();
const findmovies = require('../../utils/findmovies');
const movieinfo = require('../../utils/movieinfo');

//Procurar um filme no TMDB
router.get('/api/movies', (req, res) => {
    // recebe uma query "search"
    if (!req.query.search) {
        return res.status(500).send({ error: "Por favor defina um filme à sua pesquisa" });
    };

    try {
        findmovies(req.query.search, (error, data) => {
            if (error) {
                return res.status(400).send({ error });
            }

            return res.status(200).send(data);
        });
    } catch (e) {
        console.log("router.get(TMDBsearch) | " + e)
        return res.status(500).send({ error: "Não foi possivel efetuar a procura" });
    }
});

//Mostrar ao utilizador a info de um filme
router.get('/api/movies/:id', (req, res) => {
    //recebe o id do TMDB como parametro no url
    if (!req.params.id) {
        return res.status(500).send({ error: "Por favor defina o ID do seu filme" });
    };

    try {
        movieinfo(req.params.id, (error, data) => {
            if (error) {
                return res.status(400).send({ error });
            };

            return res.status(200).send(data);
        });
    } catch (e) {
        console.log("router.get(movieInfo) | " + e);
        return res.status(500).send({ error: "Não foi possivel efetuar a procura" });
    };
});

module.exports = router;