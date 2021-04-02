const express = require('express');
const Favourite = require('../../models/favourite');
const Movie = require('../../models/movie');
const router = new express.Router();
const auth = require('../../middleware/auth')
const movieinfo = require('../../utils/movieinfo')

const getMovies = require('../../utils/favouriteMovies');
const mail = require('../../emails/email');

// criar favorito
router.post('/api/favourite', auth, async (req, res) => {
    //recebe nome a dar ao favorito e id do filme no imdb no body
    const appMovie = await Movie.findOne({ idOnTMDB: req.body.idOnTMDB });

    if (appMovie) {
        const appFavourite = await Favourite.findOne({ myBdId: appMovie._id, owner: req.user._id });

        if (appFavourite) {

            return res.status(400).send({ error: 'Este filme já existe nos seus favoritos com o nome: ' + appFavourite.userMovieName })
        }

        try {
            const newFavourite = new Favourite({
                userMovieName: req.body.userMovieName,
                owner: req.user._id,
                myBdId: appMovie._id
            })

            await newFavourite.save();

            return res.status(201).send(newFavourite);
        } catch (e) {
            console.log("router.post(createFavourite) | " + e)
            return res.status(500).send({ error: "Não foi possivel criar o favorito" });
        }
    } else {
        movieinfo(req.body.idOnTMDB, async (error, tmdbData) => {
            try {
                if (error) {
                    return res.status(400).send({ error });
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
            } catch (e) {
                console.log("router.post(createFavourite) | " + e)
                return res.status(500).send({ error: "Não foi possivel criar o favorito" });
            }
        })
    }

});

//info do favorito
router.get('/api/favourite/:id', auth, async (req, res) => {
    //recebo o ID do favourito no parametro do URL
    try {
        const favourite = await Favourite.findOne({ _id: req.params.id, owner: req.user._id });

        if (favourite === null) {
            return res.status(404).send({ error: "Não foi encontrado nenhum favorito com o esse ID" });
        }

        let movie = await Movie.findOne({ _id: favourite.myBdId });
        movieInfo = { userMovieName: favourite.userMovieName, ...movie._doc }

        return res.status(200).send(movieInfo);
    } catch (e) {
        console.log("router.get(favInfo) | " + e)
        return res.status(500).send({ error: "Não foi possivel procurar a info do favorito" });
    }
});

//atualizar nome do favorito
router.patch('/api/favourite/:id', auth, async (req, res) => {
    //recebo o id do favorito no param do URL e no body "movie" com o novo nome a atribuir
    const keys = Object.keys(req.body);
    const allowedUpdates = ['movie'];
    const isValidOperation = keys.every((key) => allowedUpdates.includes(key));

    if (!isValidOperation) {
        return res.status(403).send({ error: 'Updates invalidos' });
    }

    try {
        const favourite = await Favourite.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, { userMovieName: req.body.movie }, { new: true });

        if (!favourite) {
            return res.status(404).send({ error: 'Não foi encontrado nenhum favorito com o esse ID' });
        }

        return res.status(200).send(favourite)
    } catch (e) {
        console.log("router.patch(patchFav) | " + e);
        return res.status(500).send({ error: 'Não foi possivel atualizar o nome do favorito' });
    }
})

//apagar favorito
router.delete('/api/favourite/:id', auth, async (req, res) => {
    try {

        const deleted = await Favourite.findByIdAndDelete({ _id: req.params.id });

        if (!deleted) {
            return res.status(404).send({ error: 'Não foi encontrado nenhum favorito com o esse ID' })
        }
        return res.status(204).send(deleted)
    } catch (e) {
        console.log("router.delete(deleteFav) | " + e)
        return res.status(500).send({ error: "Não foi possível apagar o favorito" })
    }
})

// ver favoritos
router.get('/api/favourites', auth, async (req, res) => {
    //senão receber nada, apresento todos os favoritos, posso receber como query o "movie" para pesquisar por esse nome e receber email=true para enviar os favoritos para o email
    if (!req.query.movie) {
        try {
            await req.user.populate('favourites').execPopulate();
            if (req.user.favourites.length) {
                let moviesInfo = await getMovies(req.user.favourites);

                if (req.query.email == 'true') {
                    await mail.sendFavouritesMail({ username: req.user.username, email: req.user.email }, moviesInfo)
                }
                return res.status(200).send(moviesInfo);
            }

            return res.status(404).send({ error: 'Não tem favoritos na sua lista' });
        } catch (e) {
            console.log("router.get(showFav) | " + e)
            return res.status(500).send({ error: "Não foi possivel mostrar os favoritos" });
        }
    }

    try {
        const favourites = await Favourite.find({ userMovieName: { $regex: req.query.movie }, owner: req.user._id });
        if (!Object.keys(favourites).length) {

            return res.status(404).send({ error: 'Não existe nos seus favoritos' })
        }

        let moviesInfo = await getMovies(favourites);
        if (req.query.email == 'true') {
            await mail.sendFavouritesMail({ username: req.user.username, email: req.user.email }, moviesInfo)
        }

        // console.log(movieInfo);
        return res.status(200).send(moviesInfo);
    } catch (e) {
        console.log("router.get(showFav) | " + e)
        return res.status(500).send({ error: "Não foi possível mostrar os favoritos" })
    }

})

router.get('/api/*', (req, res) => {
    res.status(404).send({ error: "Endpoint not found" });
});

module.exports = router;