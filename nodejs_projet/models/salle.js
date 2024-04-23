
const mongoose = require('mongoose');

// Schéma pour représenter une salle de réunion
const salleSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: true // Le numéro de salle est requis
    },
    status: {
        type: String,
        enum: ['disponible', 'occupée'], // Le statut doit être l'un des deux : disponible ou occupée
        default: 'disponible' // Par défaut, la salle est disponible
    },
    capacity: {
        type: Number,
        required: true // La capacité de la salle est requise
    },
    equipment: {
        type: [String], // Liste des équipements disponibles dans la salle
        default: [] // Par défaut, la salle n'a aucun équipement
    },
   
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Référence à l'utilisateur qui a créé la salle
    }
});

// Modèle pour la salle de réunion
const Salle = mongoose.model('Salle', salleSchema);

module.exports = Salle;
