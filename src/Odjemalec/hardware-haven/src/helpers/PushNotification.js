function sendPushNotification(title, message) {
    new Notification(title, {
        body: message,
        icon: process.env.PUBLIC_URL + '/logo192.png'
    });
}

export default sendPushNotification;