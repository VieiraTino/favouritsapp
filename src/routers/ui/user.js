const express = require('express');
const router = new express.Router();
const localMovieInfo = require('../../utils/localMovieInfo');
// const auth = require('../../middleware/auth');

router.get('', (req, res) => {
    res.render('index', {
        title: 'Favourites app',
    });
});

router.get('/tmdb', (req, res) => {
    res.render('tmdb', {
        title: 'Favourites app',
    });
});

router.get('/tmdb/:id', (req, res) => {

    localMovieInfo(req.params.id, (error, data) => {
        if(error){
            res.render('404')
        } else {
            data['title'] = 'Favourites app';
            res.render('movieInfo', data);
        }
    })
});

module.exports = router;