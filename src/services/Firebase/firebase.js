// import firebase from 'firebase';
import firebase from 'firebase/app'
import 'firebase/auth'
import firebaseClientInitConfig from './firebaseClientInitConfig'

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseClientInitConfig);
}

export default firebase;