const express = require('express');
const router = express.Router();
const Notification = require('../models/notification'); // Update the path to where your model is located

// POST /notifications to create a new notification
router.post('/', async (req, res) => {
    try {
        const notification = new Notification(req.body);
        await notification.save();
        res.status(201).send(notification);
    } catch (error) {
        res.status(400).send(error);
    }
});

// GET /notifications to get all notifications
router.get('/', async (req, res) => {
    try {
        const notifications = await Notification.find();
        res.send(notifications);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/user/:userId', async (req, res) => {
    try {
        const notifications = await Notification.find({ utilisateur: req.params.userId }).populate('utilisateur');
        res.send(notifications);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.patch('/:id/status-to-lu', async (req, res) => {
    const _id = req.params.id;

    try {
        const notification = await Notification.findById(_id);
        if (!notification) {
            return res.status(404).send({ message: 'Notification not found.' });
        }

        if (notification.status !== 'no_lu') {
            return res.status(400).send({ message: 'Notification status is not no_lu or already marked as read.' });
        }

        notification.status = 'lu';
        await notification.save();
        res.send(notification);
    } catch (error) {
        res.status(500).send(error);
    }
});



// DELETE /notifications/:id to delete a notification
router.delete('/:id', async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(req.params.id);
        if (!notification) {
            res.status(404).send();
        }
        res.send(notification);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
