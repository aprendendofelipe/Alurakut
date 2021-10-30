import getIdGitHubUserAuth from '../Firebase/github_firebase'

export async function UserGithubAPI(githubUserID) {
    const githubUser = await fetch(`https://api.github.com/user/${githubUserID}`)
        .then(function (res) {
            return res.json();
        })
        .then(function (json) {
            return json;
        })

    return githubUser
}

export async function UsersGithubAPI(githubUserName) {
    const githubUser = await fetch(`https://api.github.com/users/${githubUserName}`)
        .then(function (res) {
            return res.json();
        })
        .then(function (json) {
            return json;
        })

    return githubUser
}

export async function GithubAPI(url) {
    const APIres = await fetch(url)
        .then(function (res) {
            return res.json();
        })
        .then(function (json) {
            return json;
        })

    return APIres
}

export async function getGitHubUser(githubUserID) {
    try {
        const githubUserAuth = await UserGithubAPI(githubUserID)
        return githubUserAuth
    } catch (e) {
        return {}
    }
}

export async function getGitHubUserAuth(token) {
    const githubUserID = getIdGitHubUserAuth(token)
    const githubUserAuth = getGitHubUser(githubUserID)
    return githubUserAuth
}