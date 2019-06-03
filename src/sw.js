import firebase from 'firebase/app'
import 'firebase/messaging'

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyCQqPjLsa4fKf82dQ6V1iMxFlKgmDurnBA",
  authDomain: "paradigm-a1bc9.firebaseapp.com",
  databaseURL: "https://paradigm-a1bc9.firebaseio.com",
  projectId: "paradigm-a1bc9",
  storageBucket: "paradigm-a1bc9.appspot.com",
  messagingSenderId: "728943503114",
  appId: "1:728943503114:web:4ea6a4f7b7f57e71"
})

firebaseApp.messaging();
