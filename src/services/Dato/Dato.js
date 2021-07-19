import { getUserCommunitiesAlura, getAllCommunitiesAlura } from './DatoAlura'

const DatoAuthorizationAlurakut = process.env.NEXT_PUBLIC_DATO_READ_ONLY
const DatoURL = 'https://graphql.datocms.com/'

export async function getTestemonials(loginGithub, page = 1) {
  const skip = (page - 1) * 10;

  const testimonials = await fetch(DatoURL, {
    method: 'POST',
    headers: {
      'Authorization': DatoAuthorizationAlurakut,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      "query": `query  {
        _allTestimonialsMeta (
          filter: {
            receiver: {eq: "${loginGithub}"}
        }) {
        count
      },
      allTestimonials (
        filter: {
          receiver: {eq: "${loginGithub}"}
      },
      first: 10,
      skip: ${skip}
      ) {
        id 
        author
        text
      }
    }` })
  })
    .then((response) => response.json()) // Pega o retorno do response.json() e já retorna
    .then((respostaCompleta) => {
      const testimonialsVindasDoDato = respostaCompleta.data.allTestimonials || [];
      const countTesTimonialsVindasDoDato = respostaCompleta.data._allTestimonialsMeta?.count || 0;
      return { testimonialsVindasDoDato, countTesTimonialsVindasDoDato }
    })

  return {
    testimonials: testimonials.testimonialsVindasDoDato,
    countTestimonials: testimonials.countTesTimonialsVindasDoDato
  }
}


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

  console.log("CommunitiesDato: ", CommunitiesDato)
  console.log("UserCommunitiesAlura: ", UserCommunitiesAlura)

  const communities = CommunitiesDato.comunidadesVindasDoDato.concat(UserCommunitiesAlura.comunidadesVindasDoDato)

  console.log("Communities: ", communities)

  return {
    communities: communities,
    countCommunities: CommunitiesDato.countCommunitiesVindasDoDato
      + UserCommunitiesAlura.countCommunitiesVindasDoDato
  }
}

export async function getAllCommunities(page = 1) {
  const { AllCommunitiesAlura } = await getAllCommunitiesAlura(page)

  const skip = (page - 1) * 15;

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

