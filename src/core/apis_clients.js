export async function Api(endpoint, method, body, loggedUser) {
    const token = await loggedUser.getIdToken()
    if (!token) {
        return { error: 'unauthenticated' }
    }
    return await fetch(
        endpoint, {
        method: method,
        headers: {
            Authorization: token,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    })
        .then((res) => res.json())
        .then((res) => res)
        .catch((e) => {
            console.error(e)
            return e
        })
}


export async function AddTestimonial(testimonial, loggedUser) {
    return await Api('/api/testimonials', 'POST', testimonial, loggedUser)
}

export async function DelTestimonial(itemId, loggedUser) {
    return await Api('/api/testimonials', 'DELETE', { id: itemId }, loggedUser)
}

export async function AddCommunity(community, loggedUser) {
    return await Api('/api/communities', 'POST', community, loggedUser)
}

export async function DelCommunity(communityId, loggedUser) {
    return await Api('/api/communities', 'DELETE', { communityId: communityId }, loggedUser)
}

export async function AddReport(report, loggedUser) {
    return await Api('/api/report', 'POST', report, loggedUser)
}

export async function CancelReport(reportId, loggedUser) {
    return await Api('/api/report', 'DELETE', { reportId: reportId.toString() }, loggedUser)
}