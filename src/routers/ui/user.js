const express = require('express');
const router = new express.Router();
// const auth = require('../../middleware/auth');

router.get('', async (req, res) => {
    res.render('index', {
        title: 'Weather App',
        nome: "Vitor Monteiro"
    });
    // res.render('index');
});


module.exports = router;