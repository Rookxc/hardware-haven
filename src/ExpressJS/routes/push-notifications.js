var express = require('express');
var router = express.Router();
const webpush = require('web-push');

const vapidKeys = {
    publicKey: 'BCmImvDEmQLHig4EWHRvTJuYTLA7zsng_aierf9OKFK9BOE42B2YuZT67_ANmokqJqIA5j_Uawam_6YtjoWUoLY',
    privateKey: 'uXR_SN2y5FLepHr5GqOdD_2eHkk4CLBmG9aNbwxdsXo'
};

webpush.setVapidDetails(
    'mailto:alen.skorjanc@student.um.si',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

const subscriptions = [];

router.post('/subscribe', (req, res) => {
    const subscription = req.body;
    subscriptions.push(subscription);
    res.status(200).json({ message: 'Subscription successful' });
});

router.post('/send-push-notification', (req, res) => {
    const notificationData = req.body;

    subscriptions.forEach(subscription => {
        webpush.sendNotification(subscription, JSON.stringify(notificationData))
            .catch(error => {
                console.error('Error sending push notification:', error);
            });
    });

    res.status(200).json({ message: 'Push notification sent to subscribed clients' });
});

router.get('/send-mock-push-notification', (req, res) => {
    subscriptions.forEach(subscription => {
        webpush.sendNotification(subscription, JSON.stringify({ title: "test", body: "test body" }))
            .catch(error => {
                console.error('Error sending push notification:', error);
            });
    });

    res.status(200).json({ message: 'Push notification sent to subscribed clients' });
});

module.exports = router;