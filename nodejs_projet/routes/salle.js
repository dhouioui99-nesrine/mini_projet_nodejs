const express = require('express');
const authenticate = require('../middleware/authenticate');
const Salle = require('../models/salle');
const router = express.Router();


router.post('/create', async (req, res) => {
    try {
        const { number, status , capacity ,equipment } = req.body;
        const nouvelleSalle = new Salle({
            number,
            status,
            capacity,
            equipment
       
            // author: req.user 
        });
        await nouvelleSalle.save();
        res.status(201).json({message : 'Salle créée avec succès'});
    } catch (error) {
        res.status(400).send(error.message);
    }
});


router.get('/disponible', async (req, res) => {
    try {
        const salles = await Salle.find({ status: 'disponible' });
        res.status(200).json(salles);
    } catch (error) {
        res.status(500).send('Erreur du serveur');
    }
});


router.get('/all', async (req, res) => {
    try {
        const salles = await Salle.find({});
        res.status(200).json(salles);
    } catch (error) {
        res.status(500).send('Erreur du serveur');
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { number, status , capacity } = req.body;
        await Salle.findByIdAndUpdate(id, { number, status , capacity });
        res.status(200).json({message : 'Salle mise à jour avec succès'});
    } catch (error) {
        res.status(400).send(error.message);
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Salle.findByIdAndDelete(id);
        res.status(200).json({message  :'Salle supprimée avec succès'});
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const salle = await Salle.findById(id);

        if (!salle) {
            return res.status(404).send('Salle non trouvée');
        }

        res.status(200).json(salle);
    } catch (error) {
        res.status(500).send('Erreur du serveur');
    }
});


router.put('/:id/equipments', async (req, res) => {
    try {
        const { id } = req.params;
        const { equipments } = req.body;

        // Vérifier si la salle existe
        const salle = await Salle.findById(id);
        if (!salle) {
            return res.status(404).send('Salle non trouvée');
        }

        // Mettre à jour les équipements de la salle
        salle.equipment = equipments;
        await salle.save();

        res.status(200).json({message : 'Équipements mis à jour avec succès'});
    } catch (error) {
        res.status(500).send('Erreur du serveur');
    }
});


router.get('/:id/equipments', async (req, res) => {
    try {
        const { id } = req.params;

        // Trouver la salle par son ID
        const salle = await Salle.findById(id);
        if (!salle) {
            return res.status(404).send('Salle non trouvée');
        }

        // Renvoyer la liste des équipements de la salle
        res.status(200).json(salle.equipment);
    } catch (error) {
        res.status(500).send('Erreur du serveur');
    }
});





router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;


        const salle = await Salle.findById(id);
        if (!salle) {
            return res.status(404).send('Salle non trouvée');
        }


        salle.status = status;
        await salle.save();

        res.status(200).json({message : "'Statut de la salle mis à jour avec succès'"});
    } catch (error) {
        res.status(500).send('Erreur du serveur');
    }
});

module.exports = router;
