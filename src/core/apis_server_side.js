import { verifyIdToken } from 'next-firebase-auth'
import initFirebase from '../services/Firebase/initFirebase'
import { getGitHubUserAuth } from '../services/Github/github'

initFirebase()

export async function verifyAuthorization(req) {
    let error = Object()
    const token = req?.headers?.authorization

    if (token) {
        try {
            await verifyIdToken(token)
            const gitHubUserAuth = await getGitHubUserAuth(token)
            if (!githubUserAuth?.login) {
                error.statusCode = 403
                error.message = 'Not authorized'
            } else {
                return gitHubUserAuth
            }
        } catch (err) {
            error.statusCode = 403
            error.message = err
        }
    } else {
        error.statusCode = 400
        error.message = 'Missing Authorization header value'
    }
    throw new error
}
