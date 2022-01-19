import { useEffect, useState } from 'react'
import firebase from '../services/Firebase/firebase'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'

const ID_TEXT_GITHUB_LOGIN_BUTTON = ".firebaseui-idp-text-long"

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

const Firebaseui = ({ newButtonText = "" }) => {
  const [renderAuth, setRenderAuth] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRenderAuth(true)
    }
  }, [])

  function ui_callback(ui: any) {
    if (newButtonText) {
      trySeveralTimes(
        changeButtonText,
        [ui],
        20,
        5
      )
    }
  }

  function trySeveralTimes(func: Function, params: Array<any>, times: number, delay: number) {
    setTimeout(() => {
      const success = func(...params)
      if (!success) {
        if (times > 0) {
          trySeveralTimes(func, params, times - 1, delay + 1)
        }
      }
    }, delay)
  }

  function changeButtonText(ui: any) {
    const buttonText = ui?.T?.querySelector(ID_TEXT_GITHUB_LOGIN_BUTTON)
    if (buttonText) {
      buttonText.innerHTML = newButtonText
      return true
    }
    return false
  }

  return (
    <>
      {renderAuth ? (
        <StyledFirebaseAuth
          uiConfig={firebaseAuthConfig}
          firebaseAuth={firebase.auth()}
          uiCallback={(ui) => ui_callback(ui)}
        />
      ) : null}
    </>
  )
}

export default Firebaseui
