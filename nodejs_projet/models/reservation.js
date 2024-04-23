const mongoose = require('mongoose');


const reservationSchema = new mongoose.Schema({
    salle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Salle',
        
    },
    utilisateur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    dateDebut: {
        type: Date,
        required: true
    },
    dateFin: {
        type: Date,
        required: true 
    },
    titre: {
        type: String,
        required: true 
    },
    status: {
        type: String,
        enum: ['en_cours', 'accepter' , 'refuser'],
        default: 'en_cours'
    },
    description: String 
});


const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
