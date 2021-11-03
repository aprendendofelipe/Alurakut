import { getTestemonials, getTestemonialsById } from '../Dato/Testimonials'
import { UserGithubAPI, UsersGithubAPI } from '../Github/github'

function defaultProfile({ uid, login }) {
    if (uid) {
        return {
            'login': null,
            'id': uid,
            'avatar_url': `https://avatars.githubusercontent.com/u/${uid}?v=4`,
            'name': null,
            'bio': null,
            'followers': 0,
            'following': 0
        }
    } else if (login) {
        return {
            'login': login,
            'id': null,
            'avatar_url': `https://github.com/${login}.png`,
            'name': null,
            'bio': null,
            'followers': 0,
            'following': 0
        }
    }
}

function noTestimonials() {
    return {
        testimonials: [],
        countTestimonials: 0
    }
}

export async function getServerProps({ uid, login }) {
    let promises = []

    if (login) {
        promises.push(UsersGithubAPI(login).catch(() => { return defaultProfile({ uid, login }) }))
        promises.push(getTestemonials(login).catch(() => { return noTestimonials() }))
    } else {
        promises.push(UserGithubAPI(uid).catch(() => { return defaultProfile({ uid, login }) }))
        promises.push(getTestemonialsById(uid).catch(() => { return noTestimonials() }))
    }

    const responses = await Promise.all(promises)
        .then((responses) => {
            if (responses[0]?.message == "Not Found") {
                return {
                    redirect: {
                        destination: '/',
                        permanent: false,
                    }
                }
            }
            else if (responses[0].message?.indexOf('API rate limit exceeded') > -1) {
                return {
                    props: {
                        userProfile: defaultProfile({ uid, login }),
                        testimonials: responses[1]
                    },
                }
            }
            return {
                props: {
                    userProfile: responses[0],
                    testimonials: responses[1]
                },
            }
        })
    return responses
}