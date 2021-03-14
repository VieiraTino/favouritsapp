const express = require('express');
const User = require('../models/user');
const router = new express.Router();
const auth = require('../middleware/auth');

router.post('/user', async (req, res) => {
    try{
        const user = new User(req.body);
        const token = await user.generateToken();
        await user.save();
        res.status(201).send({user, token})
    } catch(e) {
        res.status(400).send(e);
    }
});

module.exports = router;