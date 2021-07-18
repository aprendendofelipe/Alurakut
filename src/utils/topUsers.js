const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'aprendendofelipe',
]

export const pessoasFavoritasOBJList = pessoasFavoritas.map((user, i) => {
    return {
        name: user,
        key: `${i}`,
        href: `/users/${user}`,
        imgSRC: `https://github.com/${user}.png`
    }
})