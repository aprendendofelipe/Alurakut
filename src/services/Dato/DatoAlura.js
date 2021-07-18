const DatoAuthorizationAlura = '7f7590695431ea76f84616a4b4d32d'
const DatoURL = 'https://graphql.datocms.com/'

export async function getUserCommunities(loginGithub, page = 1) {
  const skip = (page - 1) * 6;
  console.log("buscando comunidades")

  const Communities = await fetch(DatoURL, {
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
    communities: Communities.comunidadesVindasDoDato,
    countCommunities: Communities.countCommunitiesVindasDoDato
  }
}

export async function getAllCommunities(page = 1) {
  const skip = (page - 1) * 6;

  const Communities = await fetch(DatoURL, {
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
    communities: Communities.comunidadesVindasDoDato,
    countCommunities: Communities.countCommunitiesVindasDoDato
  }
}

