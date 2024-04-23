const express = require('express');
const authenticate = require('../middleware/authenticate');
const Reservation = require('../models/reservation');
const router = express.Router();

// Créer une nouvelle réservation
router.post('/create', authenticate, async (req, res) => {
    try {
        console.log(req.body)
        const { salle, dateDebut, dateFin, titre, description } = req.body;

        // Créer une nouvelle réservation
        const nouvelleReservation = new Reservation({
            salle,
            utilisateur: req.userId, // Utilisateur actuellement authentifié sera l'utilisateur de la réservation
            dateDebut,
            dateFin,
            titre,
            description
        });

        // Enregistrer la nouvelle réservation dans la base de données
        await nouvelleReservation.save();

        // Répondre avec succès
        res.status(201).send({message : 'Réservation créée avec succès'});
    } catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
});

// Obtenir toutes les réservations de l'utilisateur connecté
router.get('/', async (req, res) => {
    try {
        // Récupérer les réservations de l'utilisateur actuellement authentifié
        const reservations = await Reservation.find().populate('utilisateur').populate('salle')

        // Répondre avec les réservations trouvées
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).send('Erreur du serveur');
    }
});

router.get('/disponibles', async (req, res) => {
    try {
        const { dateDebut, dateFin } = req.query;

        // Trouver toutes les réservations qui chevauchent la plage horaire spécifiée
        const reservationsChevauchantes = await Reservation.find({
            $or: [
                { dateDebut: { $lt: dateFin }, dateFin: { $gt: dateDebut } }, // La réservation commence avant que la plage horaire ne se termine et se termine après que la plage horaire ne commence
                { dateDebut: { $gte: dateDebut, $lt: dateFin } }, // La réservation commence pendant la plage horaire
                { dateFin: { $gt: dateDebut, $lte: dateFin } } // La réservation se termine pendant la plage horaire
            ]
        });

        // Trouver toutes les salles
        const toutesSalles = await Salle.find({});

        // Filtrer les salles disponibles en excluant celles qui ont des réservations chevauchantes
        const sallesDisponibles = toutesSalles.filter(salle => {
            return !reservationsChevauchantes.some(reservation => reservation.salle.toString() === salle._id.toString());
        });

        res.status(200).json(sallesDisponibles);
    } catch (error) {
        res.status(500).send('Erreur du serveur');
    }
});



// Mettre à jour une réservation existante
router.put('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { salle, dateDebut, dateFin, titre,status , description  } = req.body;

        // Mettre à jour la réservation
        await Reservation.findByIdAndUpdate(id, { salle, dateDebut, dateFin, titre,status , description });

        // Répondre avec succès
        res.send({message : 'Réservation mise à jour avec succès'});
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Supprimer une réservation
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        // Supprimer la réservation
        await Reservation.findByIdAndDelete(id);

        // Répondre avec succès
        res.send('Réservation supprimée avec succès');
    } catch (error) {
        res.status(400).send(error.message);
    }
});


router.get('/:id_salle/calendar', async (req, res) => {
    try {
        const { id_salle } = req.params;
        const reservations = await Reservation.find({ salle: id_salle });

        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).send('Erreur du serveur');
    }
});

module.exports = router;
