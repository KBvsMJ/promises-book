function notifyMessage(message, options, callback) {
    if (typeof Notification === 'undefined') {
        callback(new Error('doesn\'t support Notification API'));
        return;
    }
    if (Notification.permission === 'granted') {
        var notification = new Notification(message, options);
        callback(null, notification);
    } else {
        Notification.requestPermission(function (status) {
            if (Notification.permission !== status) {
                Notification.permission = status;
            }
            if (status === 'granted') {
                var notification = new Notification(message, options);
                callback(null, notification);
            } else {
                callback(new Error('user denied'));
            }
        });
    }
}
function notifyMessageAsPromise(message, options) {
    return new Promise(function (resolve, reject) {
        notifyMessage(message, options, function (error, notification) {
            if (error) {
                reject(error);
            } else {
                resolve(notification);
            }
        });
    });
}