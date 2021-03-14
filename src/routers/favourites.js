const express = require('express');
const Favourite = require('../models/favourites');
const router = new express.Router();

router.post('/favourite', async (req, res) => {
    const newFavourite = new Favourite({
        ...req.body,
        owner: 'Ti'
    });

    try {
        console.log(newFavourite);
        await newFavourite.save();
        res.status(201).send(newFavourite);
    } catch(e) {
        res.status(400).send(e);
    }

})

module.exports = router;