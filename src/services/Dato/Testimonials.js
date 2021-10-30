export function handleDelTestimonial(e, itemId, token) {
    e.preventDefault();
    const testimonial = {
        id: itemId
    }

    fetch('/api/testimonials', {
        method: 'DELETE',
        headers: {
            Authorization: token || 'unauthenticated',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(testimonial)
    })
        .then(async (response) => {
            const dados = await response.json();
        })
}
