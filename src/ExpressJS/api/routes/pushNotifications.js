var express = require('express');
var router = express.Router();
const webpush = require('web-push');
const PushSubscription = require('../models/PushNotification');
const sendPushNotification = require('../helpers/PushNotification');

const vapidKeys = {
    publicKey: 'BCmImvDEmQLHig4EWHRvTJuYTLA7zsng_aierf9OKFK9BOE42B2YuZT67_ANmokqJqIA5j_Uawam_6YtjoWUoLY',
    privateKey: 'uXR_SN2y5FLepHr5GqOdD_2eHkk4CLBmG9aNbwxdsXo'
};

webpush.setVapidDetails(
    'mailto:alen.skorjanc@student.um.si',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

router.post('/subscribe', async (req, res) => {
    const userId = req.userId;
    const subscriptionData = req.body;

    try {
        const existingSubscription = await PushSubscription.findOne({
            userId: userId,
            endpoint: subscriptionData.endpoint,
        });

        if (!existingSubscription) {
            const newSubscription = new PushSubscription({
                userId: userId,
                endpoint: subscriptionData.endpoint,
                keys: {
                    p256dh: subscriptionData.keys.p256dh,
                    auth: subscriptionData.keys.auth,
                },
                expirationTime: subscriptionData.expirationTime || null,
            });

            await newSubscription.save();

            webpush.sendNotification(subscriptionData, JSON.stringify({
                title: "Hardware Haven",
                body: "Thank you for subscribing. We appreciate your interest!"
            }))
                .catch(error => {
                    console.error('Error sending push notification:', error);
                });
    
            return res.status(200).json({ message: 'Subscription successful' });
        }

        return res.status(200).json({ message: 'Subscription already exists' });
    } catch (error) {
        return res.status(500).json({ message: 'Subscription failed', error: error.message });
    }
});

router.post('/unsubscribe', async (req, res) => {
    const userId = req.userId;

    try {
        await PushSubscription.deleteMany({
            userId: userId
        });

        return res.status(200).json({ message: 'Unsubscription successful' });
    } catch (error) {
        return res.status(500).json({ message: 'Unsubscription failed', error: error.message });
    }
});

router.post('/send-push-notification', async (req, res) => {
    try {
        const notificationData = req.body;
        await sendPushNotification(notificationData);
        return res.status(200).json({ message: 'Push notification sent to subscribed clients' });
    } catch (error) {
        console.error('Error sending push notification:', error);
        return res.status(500).json({ message: 'Error sending push notification', error: error.message });
    }
});

module.exports = router;