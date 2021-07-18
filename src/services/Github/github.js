export async function UserGithubAPI(githubUserID) {
    const githubUser = await fetch(`https://api.github.com/user/${githubUserID}`)
        .then(function (respostaDoServidor) {
            return respostaDoServidor.json();
        })
        .then(function (respostaCompleta) {
            return respostaCompleta;
        })

    return githubUser
}

export async function UsersGithubAPI(githubUserName) {
    const githubUser = await fetch(`https://api.github.com/users/${githubUserName}`)
        .then(function (respostaDoServidor) {
            return respostaDoServidor.json();
        })
        .then(function (respostaCompleta) {
            return respostaCompleta;
        })

    return githubUser
}