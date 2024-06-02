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

router.post('/subscribe', async (req, res) => {
    const userId = req.userId;
    const subscriptionData = req.body;

    console.log(subscriptionData)

    try {
        if (!subscriptionData.userId) {
            return res.status(400).json({ message: 'User id is missing' });
        }

        const newSubscription = new PushSubscription({
            user: subscriptionData.userId,
            endpoint: subscriptionData.endpoint,
            keys: {
                p256dh: subscriptionData.keys.p256dh,
                auth: subscriptionData.keys.auth,
            },
            expirationTime: subscriptionData.expirationTime || null,
        });

        await newSubscription.save();

        return res.status(200).json({ message: 'Subscription successful' });
    } catch (error) {
        return res.status(500).json({ message: 'Subscription failed', error: error.message });
    }
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