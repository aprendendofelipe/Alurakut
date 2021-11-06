import { verifyIdToken } from 'next-firebase-auth'
import getIdGitHubUserAuth from '../services/Firebase/github_firebase'
import initFirebase from '../services/Firebase/initFirebase'
import { getGitHubUserAuth } from '../services/Github/github'

initFirebase()

export async function verifyAuthorization(req) {
    let error = Object()
    const token = req?.headers?.authorization

    if (token) {
        try {
            await verifyIdToken(token)

            if (req.method === 'POST' && req.body.itemType !== 'report') {
                const gitHubUserAuth = await getGitHubUserAuth(token)
                if (gitHubUserAuth.login) {
                    return gitHubUserAuth
                }

            } else {
                const gitHubUserId = getIdGitHubUserAuth(token)
                return { gitHubUserId }
            }
            error.statusCode = 403
            error.message = 'Not authorized'

        } catch (err) {
            error.statusCode = 403
            error.message = err
        }
    } else {
        error.statusCode = 400
        error.message = 'Missing Authorization header value'
    }

    throw error
}
