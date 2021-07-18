import { init } from 'next-firebase-auth';
import firebaseClientInitConfig from './firebaseClientInitConfig';
import tokenChangedHandler from './tokenChangedHandler'
import APIconfig from '../../utils/Cookies/APIconfig'

const initFirebase = () => {
  init({
    debug: false,
    authPageURL: '/login',
    appPageURL: '/',
    tokenChangedHandler: tokenChangedHandler,
    firebaseAdminInitConfig: {
      credential: {
        projectId: firebaseClientInitConfig.projectId,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY
          ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') //JSON.parse(process.env.FIREBASE_PRIVATE_KEY)
          : undefined,
      },
      databaseURL: firebaseClientInitConfig.databaseURL,
    },
    firebaseClientInitConfig: firebaseClientInitConfig,
    cookies: APIconfig,
  })
}

export default initFirebase
