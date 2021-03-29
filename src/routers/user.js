const express = require('express');
const User = require('../models/user');
const Favourites = require('../models/favourite');
const router = new express.Router();
const auth = require('../middleware/auth');
const Favourite = require('../models/favourite');

const mail = require('../emails/email');

router.post('/api/user', async (req, res) => {
    try{
        const user = new User(req.body);
        const token = await user.generateToken();
        await mail.sendWelcomeMail({username: req.body.username, email: req.body.email});

        await user.save();
        
        res.status(201).send({user, token})
    } catch(e) {
        res.status(400).send(e);
    }
});

router.delete('/api/user', auth, async (req, res) => {
    try {
        await req.user.remove();
        await mail.sendCancelMail({username: req.user.username, email: req.user.email})
        res.send({deletedUserInfo: req.user, message: 'User apagado com sucesso'});
    } catch(e) {
        res.status(404).send(e);
    }
})

router.patch('/api/user', auth, async (req, res) => {

    const keys = Object.keys(req.body);
    const allowedUpdates = ['username', 'password', 'email'];
    const isValidOperation = keys.every((key) => allowedUpdates.includes(key));

    if(!isValidOperation) {
        return res.status(400).send({error: 'Updates invalidos'});
    }

    try {
        keys.forEach((key) => req.user[key] = req.body[key])
        await req.user.save();
        
        res.send(req.user);
    } catch(e) {
        res.status(400).send(e);
    }
})

router.post('/api/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.username, req.body.password);
        const token = await user.generateToken();

        res.send({username: user.username, token});
    } catch(e) {
        res.status(500).send(e);
    }
});

router.post('/api/user/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        })

        await req.user.save()
        res.send({message: 'Logout efetuado com sucesso'})

    } catch(e) {
        res.status(500).send({error: "Podes te ir embora, não é local para hacking!"})
    }
});

router.post('/api/user/logoutall', auth, async (req, res) => {
    try{
        
        req.user.tokens = [];
        
        await req.user.save();
        res.send({message: 'Logout de todos os equipamentos efetuado com sucesso'})

    } catch(e) {
        res.status(500).send({error: "Podes te ir embora, não é local para hacking!"})
    }
})

module.exports = router;