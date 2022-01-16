/* globals window */
import { useEffect, useState } from 'react'
import firebase from '../services/Firebase/firebase'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'

const firebaseAuthConfig = {
  signInFlow: 'popup',
  signInOptions: [
    {
      provider: firebase.auth.GithubAuthProvider.PROVIDER_ID,
    },
  ],
  signInSuccessUrl: '/',
  credentialHelper: 'none',
  callbacks: {
    signInSuccessWithAuthResult: () =>
      false,
  },
}

const Firebaseui = () => {
  const [renderAuth, setRenderAuth] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRenderAuth(true)
    }
  }, [])

  return (
    <div>
      {renderAuth ? (
        <StyledFirebaseAuth
          uiConfig={firebaseAuthConfig}
          firebaseAuth={firebase.auth()}
        />
      ) : null}
    </div>
  )
}

export default Firebaseui
