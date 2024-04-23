const mongoose = require('mongoose');


const notificationSchema = new mongoose.Schema({
    salle: {
        type: String,
    },
    utilisateur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    date: {
        type: Date,
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
        enum: ['no_lu', 'lu' ],
        default: 'no_lu'
    },
    type: {
        type: String,
        enum: ['response', 'demande' ],
        default: 'response'
    },
    description: String 
});


const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;