const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Assurez-vous que le chemin d'accès est correct
const authenticate = require('../middleware/authenticate')
// Route pour créer un nouvel utilisateur
router.post('/users', async (req, res) => {
    try {
        const { username, password, email,  tel, Role } = req.body;
        const user = new User({ username, password, email, tel, Role });
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Route pour obtenir tous les utilisateurs
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Route pour obtenir un utilisateur par son ID
router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ message: "Utilisateur introuvable" });
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/currentUser',authenticate ,async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).send({ message: "Utilisateur introuvable" });
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Route pour mettre à jour un utilisateur par son ID
router.put('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            return res.status(404).send({ message: "Utilisateur introuvable" });
        }
        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Route pour supprimer un utilisateur par son ID
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send({ message: "Utilisateur introuvable" });
        }
        res.send({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
