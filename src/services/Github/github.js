import getIdGitHubUserAuth from '../Firebase/github_firebase'

export async function UserGithubAPI(githubUserID) {
    console.log('UserGithubAPI')
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
    console.log('UsersGithubAPI')
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
    const githubUserAuth = await UserGithubAPI(githubUserID)
    return githubUserAuth
}

export async function getGitHubUserAuth(token) {
    const githubUserID = getIdGitHubUserAuth(token)
    const githubUserAuth = getGitHubUser(githubUserID)
    return githubUserAuth
}