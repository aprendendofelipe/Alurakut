const DatoAuthorizationAlurakut = process.env.NEXT_PUBLIC_DATO_READ_ONLY
const DatoURL = process.env.NEXT_PUBLIC_DATO_URL

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
      skip: ${skip},
      orderBy: id_DESC
      ) {
        id 
        author
        authorId
        receiverId
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

export async function getTestemonialsById(UserIdGithub, page = 1) {
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
              receiverId: {eq: "${UserIdGithub}"}
          }) {
          count
        },
        allTestimonials (
          filter: {
            receiverId: {eq: "${UserIdGithub}"}
        },
        skip: ${skip},
        orderBy: id_DESC
        ) {
          id 
          author
          authorId
          receiverId
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
