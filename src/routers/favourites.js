const express = require('express');
const Favourite = require('../models/favourite');
const Movie = require('../models/movie');
const router = new express.Router();
const auth = require('../middleware/auth')
const movieinfo = require('../utils/movieinfo')

// criar favorito -> recebe nome a dar ao favorito e id do filme no imdb
router.post('/favourite', auth, async (req, res) => {
    const appMovie = await Movie.findOne({idOnTMDB: req.body.idOnTMDB});
        
    if(appMovie){
        const appFavourite = await Favourite.findOne({myBdId: appMovie._id , owner: req.user._id});

        if(appFavourite){

            return res.status(400).send({error: 'Este filme já existe nos seus favoritos com o nome: ' + appFavourite.userMovieName})
        }

        try{
            const newFavourite = new Favourite({
                userMovieName: req.body.userMovieName,
                owner: req.user._id,
                myBdId: appMovie._id
            })
            
            await newFavourite.save();

            return res.status(201).send(newFavourite);
        } catch(e) {
            return res.status(400).send(e);
        }
    } else {
        movieinfo(req.body.idOnTMDB, async (error, tmdbData) => {
            try{
                if(error) {
                    return res.status(400).send(error);
                }
    
                const newMovie = new Movie({
                    idOnTMDB: req.body.idOnTMDB,
                    tmdbData
                })
    
                await newMovie.save();
    
                const newFavourite = new Favourite({
                    userMovieName: req.body.userMovieName,
                    owner: req.user._id,
                    myBdId: newMovie._id
                })
                
                await newFavourite.save();
    
                return res.status(201).send(newFavourite);
            } catch(e) {
                res.status(400).send(e);
            }
        })
    }

});

// info do favorito
router.get('/favourite/:id', auth, async (req, res) => {
    try {
        const favourite = await Favourite.findOne({_id: req.params.id, owner: req.user._id});

        if(favourite === null){
            return res.status(400).send({error: "Não foi encontrado nenhum favorito com o esse ID"});
        }
        res.status(200).send(favourite);
    } catch(e) {
        res.status(400).send(e);
    }
});

//atualizar nome do favorito
router.patch('/favourite/:id', auth, async (req, res) => {
    const keys = Object.keys(req.body);
    const allowedUpdates = ['movie'];
    const isValidOperation = keys.every((key) => allowedUpdates.includes(key));

    if(!isValidOperation){
        return res.status(400).send({error: 'Updates invalidos'});
    }

    try {
        const favourite = await Favourite.findOneAndUpdate({_id: req.params.id, owner: req.user._id}, {userMovieName: req.body.movie}, {new: true});

        if(!favourite) {
            return res.status(400).send({error: 'Não foi encontrado nenhum favorito com o esse ID'});
        }

        console.log(req.params)

        res.status(200).send(favourite)

    } catch(e) {
        console.log(e);
        res.status(401).send({error: 'O ID introduzido não é válido',});
    }
})

//ver todos os favoritos. Se receber uma query "movie" verifica se esse nome existe nos favoritos
router.get('/favourites', auth, async (req, res) => {
    if(Object.keys(req.query).length){
        try {
            const favourite = await Favourite.find({userMovieName: { $regex: req.query.movie }, owner: req.user._id});
// RESOLVER: Se for minusculas e o titlo estiver maiuscula, não encontra.
            if(!Object.keys(favourite).length){
                return res.status(400).send({error: 'Não existe nos seus favoritos'})
            }

            return res.status(201).send(favourite);

        } catch(e){
            return res.status(400).send(e)
        }
    }

    try{
        await req.user.populate('favourites').execPopulate();
        res.status(201).send(req.user.favourites);
    } catch(e) {
        res.status(400).send(e);
    }
});


module.exports = router;