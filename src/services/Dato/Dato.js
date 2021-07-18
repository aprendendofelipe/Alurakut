const DatoAuthorizationAlurakut = process.env.DATO_FULL_ACCESS_TOKEN
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
      const testimonialsVindasDoDato = respostaCompleta.data.allTestimonials;
      const countTesTimonialsVindasDoDato = respostaCompleta.data._allTestimonialsMeta.count;
      return { testimonialsVindasDoDato, countTesTimonialsVindasDoDato }
    })

  return {
    testimonials: testimonials.testimonialsVindasDoDato,
    countTestimonials: testimonials.countTesTimonialsVindasDoDato
  }
}