const express = require('express');
const router = new express.Router();

router.get('/favourites', async (req, res) => {

    try {
        console.log('resultou')
        res.status(201).send('Resultou');
    } catch(e) {
        res.status(400).send(e);
    }

})

module.exports = router;