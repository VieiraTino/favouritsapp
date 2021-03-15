const express = require('express');
const Favourite = require('../models/favourites');
const router = new express.Router();
const auth = require('../middleware/auth')

router.post('/favourite', auth, async (req, res) => {
    const newFavourite = new Favourite({
        ...req.body,
        owner: req.user._id
    });

    try {
        await newFavourite.save();
        res.status(201).send(newFavourite);
    } catch(e) {
        res.status(400).send(e);
    }

})

router.get('/favourite', auth, async (req, res) => {
    const keys = Object.keys(req.query);
    const allowedUpdates = ['movie', 'idOnTMDB'];
    const isValidOperation = keys.every((key) => allowedUpdates.includes(key));
    
    if(!isValidOperation) {
        return res.status(400).send({error: 'Pesquisa inválida'});
    }
    
    try {
        const favourite = await Favourite.find({...req.query, owner: req.user._id});
        if(favourite.length === 0){
            return res.status(200).send({error: 'Nenhum resultado, redefina a sua pesquisa.'});
        }
        res.status(200).send(favourite);
    } catch(e) {
        res.status(400).send(e);
    }
})

router.get('/favourites', auth, async (req, res) => {
    try{
        await req.user.populate('favourites').execPopulate();
        res.status(201).send(req.user.favourites);
    } catch(e) {
        res.status(400).send(e);
    }
});

router.patch('/favourite', auth, async (req, res) => {
    const keys = Object.keys(req.body);
    const allowedUpdates = ['movie', 'idOnTMDB'];
    const isValidOperation = keys.every((key) => allowedUpdates.includes(key));

    if(!isValidOperation){
        return res.status(400).send({error: 'Updates invalidos'});
    }

    try {

        // keys.forEach((key) => req.user[key] = req.body[key])
        // await req.favourite.save();

        res.send('sim');
    } catch(e) {
        res.status(400).send(e);
    }
})



module.exports = router;