import firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/firestore'
import 'firebase/performance'
import 'firebase/auth'

var config = {
	apiKey: "AIzaSyCQqPjLsa4fKf82dQ6V1iMxFlKgmDurnBA",
	authDomain: "paradigm-a1bc9.firebaseapp.com",
	databaseURL: "https://paradigm-a1bc9.firebaseio.com",
	projectId: "paradigm-a1bc9",
	storageBucket: "paradigm-a1bc9.appspot.com",
	messagingSenderId: "728943503114",
	appId: "1:728943503114:web:8d2078f0daca6019"
}

const firebaseApp = firebase.initializeApp(config)

const auth = firebaseApp.auth()
const storage = firebaseApp.storage().ref()
const db = firebaseApp.firestore()
const perf = firebaseApp.performance()

export { db, storage, perf, auth }