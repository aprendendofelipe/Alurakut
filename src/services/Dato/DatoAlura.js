const DatoAuthorizationAlura = '7f7590695431ea76f84616a4b4d32d'
const DatoURL = 'https://graphql.datocms.com/'

export async function getUserCommunitiesAlura(loginGithub, page = 1) {
  const skip = (page - 1) * 6;

  const UserCommunitiesAlura = await fetch(DatoURL, {
    method: 'POST',
    headers: {
      'Authorization': DatoAuthorizationAlura,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      "query": `query {
        _allCommunitiesMeta (
          filter: {
            creatorSlug: {eq: "${loginGithub}"}
        }) {
          count
        },
        allCommunities (
          filter: {
            creatorSlug: {eq: "${loginGithub}"}
        },
        first: 6,
        skip: ${skip}
        ) {
          id 
          title
          imageUrl
          creatorSlug
        }
      }` })
  })
    .then((response) => response.json()) // Pega o retorno do response.json() e já retorna
    .then((respostaCompleta) => {
      const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
      const countCommunitiesVindasDoDato = respostaCompleta.data._allCommunitiesMeta.count;
      return { comunidadesVindasDoDato, countCommunitiesVindasDoDato }
    })

  return {
    UserCommunitiesAlura
  }
}

export async function getAllCommunitiesAlura(skip = 0, current = []) {

  const current_array = current.map(
    (title) => `"${title}"`
  )

  const AllCommunitiesAlura = await fetch(DatoURL, {
    method: 'POST',
    headers: {
      'Authorization': DatoAuthorizationAlura,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      "query": `query {
      _allCommunitiesMeta {
        count
      },
      allCommunities (
      first: 15,
      skip: ${skip},
      filter:{
        creatorSlug: {neq: "omariosouto"}
        title: {notIn: [${current_array}]
        }
      }) {
        id 
        title
        imageUrl
        creatorSlug
      }
    }` })
  })
    .then((response) => response.json()) // Pega o retorno do response.json() e já retorna
    .then((respostaCompleta) => {
      const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
      const countCommunitiesVindasDoDato = respostaCompleta.data._allCommunitiesMeta.count;
      return { comunidadesVindasDoDato, countCommunitiesVindasDoDato }
    })

  return {
    AllCommunitiesAlura
  }
}

