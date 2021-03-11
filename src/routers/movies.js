const express = require('express');
const router = new express.Router();
const findmovies = require('../utils/findmovies');
const movieinfo = require('../utils/movieinfo');

router.get('/movies', (req, res) => {
    // receber o nome do filme e mostrar ao utilizador
    if(!req.query.search){
        return res.send({
            error: "Por favor defina um filme à sua pesquisa"
        });
    };

    try {
        findmovies(req.query.search, (error, data) => {
            if(error) {
                res.status(400).send({ error });
            }
    
            res.status(201).send(data);
        });
    } catch(e) {
        res.status(400).send(e);
    }
});

router.get('/movies/:id', (req, res) => {
    // receber o ID do filme e mostrar ao utilizador a info desse filme
    if(!req.params.id){
        return res.status(400).send({
            error: "Por favor defina o ID do seu filme"
        });
    };

    try {
        movieinfo(req.params.id, (error, data) => {
            if(error) {
                res.status(400).send({ error });
            };
    
            res.status(201).send(data);
        });
    } catch(e) {
        res.status(400).send(e);
    };
});

module.exports = router;