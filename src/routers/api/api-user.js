const express = require('express');
const User = require('../../models/user');
const Favourites = require('../../models/favourite');
const router = new express.Router();
const auth = require('../../middleware/auth');
const Favourite = require('../../models/favourite');

const mail = require('../../emails/email');

//criar utilizador na aplicação
router.post('/api/user', async (req, res) => {
    //recebe user/pass/email
    try {
        const user = new User(req.body);
        const token = await user.generateToken();
        await mail.sendWelcomeMail({ username: req.body.username, email: req.body.email });

        await user.save();

        return res.status(201).send({ user, token })
    } catch (e) {
        console.log("router.post" + e)
        return res.status(400).send({ error: 'Ocorreu um erro a criar o utilizador' });
    }
});

//Apagar utilizador da aplicação
router.delete('/api/user', auth, async (req, res) => {
    //recebe token
    try {
        await req.user.remove();
        await mail.sendCancelMail({ username: req.user.username, email: req.user.email });
        return res.status(204).send({ deletedUserInfo: req.user, message: 'User apagado com sucesso' });
    } catch (e) {
        console.log("router.delete | " + e)
        return res.status(400).send({ error: 'Ocorreu um erro a apagar o cliente' });
    }
})

//Atualiza dados do utilizador na aplicação
router.patch('/api/user', auth, async (req, res) => {
    //Recebe user/pass/email
    const keys = Object.keys(req.body);
    const allowedUpdates = ['username', 'password', 'email'];
    const isValidOperation = keys.every((key) => allowedUpdates.includes(key));

    if (!isValidOperation) {
        return res.status(403).send({ error: 'Updates invalidos' });
    }

    try {
        keys.forEach((key) => req.user[key] = req.body[key]);
        await req.user.save();

        return res.status(200).send(req.user);
    } catch (e) {
        console.log("router.patch | " + e);
        return res.status(500).send({ error: "Não foi possível atualizar os dados no servidor." });
    }
})

// testar
//Fazer login na aplicação
router.post('/api/login', async (req, res) => {
    //Recebe user/pass
    try {
        const user = await User.findByCredentials(req.body.username, req.body.password);

        if (!user) {
            return res.status(404).send({ error: 'O utilizador não existe' });
        }

        const token = await user.generateToken();

        return res.status(200).send({ username: user.username, token });
    } catch (e) {
        console.log("router.post(login) | " + e)
        return res.status(500).send({ error: 'Aconteceu um erro a fazer o login' });
    }
});

//fazer logout do equipamento
router.post('/api/user/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        })

        await req.user.save();
        return res.status(200).send({ message: 'Logout efetuado com sucesso' })

    } catch (e) {
        console.log("router.post(logout) | " + e);
        return res.status(500).send({ error: "Não foi possível efetuar o logout" });
    }
});

//fazer logout de todos os equipamentos
router.post('/api/user/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = [];

        await req.user.save();
        return res.status(200).send({ message: 'Logout de todos os equipamentos efetuado com sucesso' })

    } catch (e) {
        return res.status(500).send({ error: "Não foi possível efetuar o logout" });
    }
})

module.exports = router;