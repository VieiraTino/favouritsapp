const express = require('express');
const router = new express.Router();
const localMovieInfo = require('../../utils/localMovieInfo');

router.get('', (req, res) => {
    res.status(200).render('index', {
        title: 'Favourites app',
    });
});

router.get('/register', (req, res) => {
    res.status(200).render('register', {
        title: 'Favourites app',
    });
});

router.get('/tmdb', (req, res) => {
    res.status(200).render('tmdb', {
        title: 'Favourites app',
    });
});

router.get('/tmdb/:id', (req, res) => {

    localMovieInfo(req.params.id, (error, data) => {
        if (error) {
            res.status(404).render('404');
        } else {
            data['title'] = 'Favourites app';
            res.status(200).render('movieInfo', data);
        }
    })
});

router.get('*', (req, res) => {
    res.status(404).render('404');
});

module.exports = router;