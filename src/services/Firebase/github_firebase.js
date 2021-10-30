import jwt from 'jsonwebtoken'

export default function getIdGitHubUserAuth(token) {
    const { identities } = jwt.decode(token).firebase
    const githubUserID = identities['github.com'][0]
    return githubUserID
}

