const PushNotifications = require('@pusher/push-notifications-server');

let pushNotifications = new PushNotifications({
  instanceId: '2fd264ad-d328-4d0a-9c7d-344b458fa29d',
  secretKey: '943237C03A6E7CCD023536024E8B8F04565BA208D178A1E3207BAC8A59D7E8D1'
});

exports.sendNotification = function(userId, callback) {
    pushNotifications.publish(['hello'], {
      apns: {
        aps: {
          alert: 'Hello!'
        }
      },
      fcm: {
        notification: {
          title: 'Hello',
          body: 'Hello, world!'
        }
      }
    }).then((publishResponse) => {
      console.log('room:', userId);
      console.log('Just published:', publishResponse.publishId);
    }).catch((error) => {
      console.log('Error:', error);
    });
}
