export async function PostsApiClient(method, body, loggedUser) {
    try {
        const token = await loggedUser.getIdToken()
        if (!token) {
            return { error: 'unauthenticated' }
        }
        return await fetch('/api/posts', {
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
                throw e
            })
    } catch (e) {
        console.error(e)
        return e
    }
}
