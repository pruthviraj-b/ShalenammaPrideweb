const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.onNewAnnouncement = functions.database
  .ref('/announcements/{announcementId}')
  .onCreate(async (snapshot, context) => {
    const data = snapshot.val();
    
    const message = {
      topic: 'announcements',
      data: {
        type: 'announcement',
        title: data.title || '',
        body: data.body || '',
        priority: data.priority || 'normal',
        imageUrl: data.mediaUrl || '',
        mediaType: data.type || 'text'
      },
      android: {
        priority: data.priority === 'urgent' ? 'high' : 'normal',
      }
    };
    
    try {
      await admin.messaging().send(message);
      console.log('Push notification sent for announcement:', context.params.announcementId);
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  });
