import { getUserCommunitiesAlura, getAllCommunitiesAlura } from './CommunitiesAlura'

const DatoAuthorizationAlurakut = process.env.NEXT_PUBLIC_DATO_READ_ONLY
const DatoURL = 'https://graphql.datocms.com/'


export async function getUserCommunities(loginGithub, page = 1) {

  const { UserCommunitiesAlura } = await getUserCommunitiesAlura(loginGithub, page)

  const skip = (page - 1) * 6;

  const CommunitiesDato = await fetch(DatoURL, {
    method: 'POST',
    headers: {
      'Authorization': DatoAuthorizationAlurakut,
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
      const countCommunitiesVindasDoDato = respostaCompleta.data._allCommunitiesMeta?.count || 0;
      return { comunidadesVindasDoDato, countCommunitiesVindasDoDato }
    })

  const communities = CommunitiesDato.comunidadesVindasDoDato.concat(UserCommunitiesAlura.comunidadesVindasDoDato)

  return {
    communities: communities,
    countCommunities: CommunitiesDato.countCommunitiesVindasDoDato
      + UserCommunitiesAlura.countCommunitiesVindasDoDato
  }
}

export async function getAllCommunities(skip = 0, current = []) {
  const { AllCommunitiesAlura } = await getAllCommunitiesAlura(skip, current)

  const DatoCommunities = await fetch(DatoURL, {
    method: 'POST',
    headers: {
      'Authorization': DatoAuthorizationAlurakut,
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
      const countCommunitiesVindasDoDato = respostaCompleta.data._allCommunitiesMeta?.count || 0;
      return { comunidadesVindasDoDato, countCommunitiesVindasDoDato }
    })

  return {
    communities: DatoCommunities.comunidadesVindasDoDato,
    aluraCommunities: AllCommunitiesAlura.comunidadesVindasDoDato,
    countCommunities: DatoCommunities.countCommunitiesVindasDoDato,
    countCommunitiesAlura: AllCommunitiesAlura.countCommunitiesVindasDoDato
  }
}

