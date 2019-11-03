const functions = require('firebase-functions');
const admin = require('firebase-admin');
const ytdl = require('ytdl-core')
const express = require('express');
const cors = require('cors');
const app = express();
admin.initializeApp();

exports.sendNotifications = functions.firestore.document('flamechat/chatrooms/{chatroom}/{message}').onCreate(snapshot => {
  // Notification details.
  const payload = {
    notification: {
      title: `${snapshot.data().name} posted a message on ${snapshot.data().chatroom}`,
      body: snapshot.data().content,
      icon: snapshot.data().pic,
      click_action: 'https://www.theparadigmdev.com/'
    }
  };

  // Get the list of device tokens.
  return admin.firestore().collection('paradigm').doc('fcm_keys').get().then(doc => {
    var tokens = doc.data().values;
    admin.messaging().sendToDevice(tokens, payload);
    // const response = await admin.messaging().sendToDevice(allTokens, payload);
    // await cleanupTokens(response, tokens);
  });
});

exports.deleteUser = functions.https.onCall(data => {
  if (data.isAdmin === true) {
    admin.firestore().collection('users').doc(data.username).delete().then(() => {
      admin.auth().deleteUser(data.uid).then(() => {
        return true
      })
    })
  } else {
    return false
  }
})

exports.clearChatroom = functions.https.onCall(data => {
  if (data.isAdmin === true) {
    functions.firestore.delete(`flamechat/chatrooms/${data.chatroom_id}`, {
      project: process.env.GCLOUD_PROJECT,
      recursive: true,
      yes: true,
      token: functions.config().fb.token
    }).then(() => {
      return true
    }).catch(error => {
      return false, error
    })
  } else {
    return false
  }
})

// function cleanupTokens(response, tokens) {
//   // For each notification we check if there was an error.
//     const tokensToRemove = {};
//     response.results.forEach((result, index) => {
//       const error = result.error;
//       if (error) {
//         console.error('Failure sending notification to', tokens[index], error);
//         // Cleanup the tokens who are not registered anymore.
//         if (error.code === 'messaging/invalid-registration-token' ||
//             error.code === 'messaging/registration-token-not-registered') {
//           tokensToRemove[`/fcmTokens/${tokens[index]}`] = null;
//         }
//       }
//     });
//     return admin.database().ref().update(tokensToRemove);
//   }

exports.getYTDownloadLink = functions.https.onCall((data, context) => {
	ytdl.getInfo(data.url, (error, info) => {
    return info.formats[0].url
  })
})