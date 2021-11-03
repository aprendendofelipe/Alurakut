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
      first: 10,
      skip: ${skip}
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
        first: 10,
        skip: ${skip}
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

export async function AddTestimonial(testimonial, authorization) {
    const testimonialCreated = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
            Authorization: authorization || 'unauthenticated',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(testimonial)
    })
        .then((response) => response.json())
        .then((respostaCompleta) => {
            return respostaCompleta
        })
    return testimonialCreated
}


export async function DelTestimonial(itemId, authorization) {
    const testimonial = { id: itemId }

    const testimonialDeleted = await fetch('/api/testimonials', {
        method: 'DELETE',
        headers: {
            Authorization: authorization || 'unauthenticated',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(testimonial)
    })
        .then((response) => response.json())
        .then((respostaCompleta) => {
            return respostaCompleta
        })
        .catch(e => e)
    return testimonialDeleted
}