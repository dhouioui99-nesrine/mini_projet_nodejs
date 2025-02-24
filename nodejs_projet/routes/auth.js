//create router register,login
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const User = require('../models/user');
const { Mongoose } = require('mongoose');
const router = express.Router();


router.get('/registe', (req, res) => {
    res.render('register');
  });

router.post('/register', async (req, res) => {
   
    try {
        const { username, password , email   } = req.body;
       
       
        const user = new User({ username,
            email,
            password});
        await user.save();
        res.status(201).send({message : 'User registered successfully'});
    } catch (error) {
        console.log(error)
        res.status(400).send(error.message)
    }
})

// login

router.get('/login', (req, res) => {
    res.render('login');
  });

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(404).send('user not found')
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).send('invalid password')
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.send({ token: token })
    } catch (error) {
        res.status(400).send(err.message)
    }
});

module.exports = router;