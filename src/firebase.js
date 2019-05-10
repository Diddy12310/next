import firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/firestore'
import 'firebase/performance'

var config = {
	apiKey: "AIzaSyD461iNFe7wlt0ppQHxtUOb1rtVBZ5Obz4",
	authDomain: "paradigm-a1bc9.firebaseapp.com",
	databaseURL: "https://paradigm-a1bc9.firebaseio.com",
  projectId: "paradigm-a1bc9",
  storageBucket: "paradigm-a1bc9.appspot.com",
	messagingSenderId: "728943503114",
	appId: "1:728943503114:web:4ea6a4f7b7f57e71"
}

const firebaseApp = firebase.initializeApp(config)

var storage = firebaseApp.storage().ref()
var db = firebaseApp.firestore()
var perf = firebaseApp.performance()

export { db, storage, perf }