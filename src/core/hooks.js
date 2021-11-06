import { useState, useEffect } from 'react'
import firebase from '../services/Firebase/firebase'
import tokenChangedHandler from '../services/Firebase/tokenChangedHandler'
import { UserGithubAPI } from '../services/Github/github'

function defaultUser(gitHubUser) {
    return {
        displayName: gitHubUser?.name,
        gitHubUserId: gitHubUser?.id,
        photoURL: gitHubUser?.avatar_url,
        getIdToken: async () => { },
        signOut: async () => firebase.auth().signOut()
    }
}

export function useLoggedUser(gitHubUser) {
    const [loggedUser, setLoggedUser] = useState(defaultUser(gitHubUser))

    async function onIdTokenChange(firebaseUser) {
        if (firebaseUser) {
            if (!loggedUser.gitHubUserId) {
                const loggedUserObj = {
                    displayName: firebaseUser.displayName || firebaseUser.providerData[0].displayName,
                    gitHubUserId: firebaseUser.providerData[0].uid,
                    photoURL: firebaseUser.photoURL,
                    getIdToken: async (forceRefresh) => firebaseUser.getIdToken(forceRefresh),
                    signOut: async () => firebase.auth().signOut()
                }
                setLoggedUser(loggedUserObj)
            }
        } else {
            if (!loggedUser.gitHubUserId) {
                setLoggedUser(defaultUser())
            }
            await tokenChangedHandler({ email: null })
        }
    }

    useEffect(() => {
        // https://firebase.google.com/docs/reference/js/firebase.auth.Auth#onidtokenchanged
        const unsubscribe = firebase.auth().onIdTokenChanged(onIdTokenChange)
        return () => unsubscribe()
    }, [gitHubUser])

    return loggedUser
}

export function useGitHubUserAPI(userId, gitHubUser) {
    const [gitHubUserAPI, setGitHubUserAPI] = useState(gitHubUser)

    async function getGitHubUser(userId) {
        const gitHubUserAPI = await UserGithubAPI(userId)
        setGitHubUserAPI(gitHubUserAPI)
    }

    useEffect(() => {
        if (gitHubUser?.login) {
            setGitHubUserAPI(gitHubUser)
        } else if (userId) {
            getGitHubUser(userId)
        } else {
            setGitHubUserAPI({})
        }
    }, [userId])

    return gitHubUserAPI
}