var express = require('express');
var router = express.Router();
const webpush = require('web-push');

const vapidKeys = {
    publicKey: 'BGhOI3HPFMfeRwGMG9h7kexDfLt8xjYpGfL_ma-WfkuS-n9fYLCh3WPIWRmj4VnxVMrP61bt1TtJjc_tOxfpGiM',
    privateKey: 'kXhzBStzhFE-ZSFElnM0YNXGmIpQcrO6zHIToHlKnCo'
};

webpush.setVapidDetails(
    'mailto:alen.skorjanc@student.um.si',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

let subscriptions = [];

router.post('/subscribe', (req, res) => {
    const subscription = req.body;
    subscriptions.push(subscription);
    res.status(201).json({ message: 'Subscription successful' });
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

module.exports = router;