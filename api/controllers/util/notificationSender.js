const PushNotifications = require('@pusher/push-notifications-server');

let pushNotifications = new PushNotifications({
  instanceId: '2fd264ad-d328-4d0a-9c7d-344b458fa29d',
  secretKey: '943237C03A6E7CCD023536024E8B8F04565BA208D178A1E3207BAC8A59D7E8D1'
});

// sends a notification to the user id
exports.sendNotification = function(userId, title, notiBody, callback) {
    pushNotifications.publish([userId.toString()], {
      apns: {
        aps: {
          alert: 'Hello!'
        }
      },
      fcm: {
        notification: {
          title: title,
          body: notiBody
        }
      }
    }).then((publishResponse) => {
      console.log('room:', userId.toString());
      console.log('title:', title);
      console.log('notiBody:', notiBody);
      console.log('Just published:', publishResponse.publishId);
    }).catch((error) => {
      console.log('Error:', error);
    });
}

pushNotifications.publish(['hello'], {
  apns: {
    aps: {
      alert: 'Hello!'
    }
  },
  fcm: {
    notification: {
      title: 'Yayas calientes en tu zona',
      body: 'Click per a anar a la App'
    }
  }
}).then((publishResponse) => {
  console.log('Just published:', publishResponse.publishId);
}).catch((error) => {
  console.log('Error:', error);
});
