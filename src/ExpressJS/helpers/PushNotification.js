const PushSubscription = require('../models/PushNotification');
const webpush = require('web-push');

async function sendPushNotification(notificationData) {
    try {
        const subscriptions = await PushSubscription.find();
        await Promise.all(subscriptions.map(async (subscription) => {
            try {
                await webpush.sendNotification(subscription, JSON.stringify(notificationData));
            } catch (error) {
                console.log(`Failed to send push notification for userId ${subscription.userId} and subscriptionId ${subscription._id}, error: ${error}`);
            }
        }));
    } catch (error) {
        throw error;
    }
}

module.exports = sendPushNotification;