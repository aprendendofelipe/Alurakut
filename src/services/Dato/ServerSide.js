import { SiteClient } from 'datocms-client'
import { verifyAuthorization } from '../../core/apis_server_side'
import { UsersGithubAPI } from '../Github/github'

const DATO_TOKEN = process.env.DATO_FULL_ACCESS_TOKEN
// Models IDs
const TESTIMONIALS_ITEM_TYPE = "976594"
const COMMUNITIES_ITEM_TYPE = "980113"
const REPORTS_ITEM_TYPE = "1356689"

const datocms = SiteClient(DATO_TOKEN)

export async function datoReqs(req, res) {
    try {
        const UserAuth = await verifyAuthorization(req)

        if (req.method === 'POST') {
            return await datoCreate(req, res, UserAuth)

        } else if (req.method === 'DELETE') {
            return await datoUnpublish(req, res, UserAuth)
        }

        return res.status(404).json({ message: 'invalid method' })

    } catch (error) {
        return res.status(error.statusCode || 500).json(error)
    }
}

function itemCreator(user, body) {
    switch (body.itemType) {
        case 'testimonial':
            return testimonialCreator(user, body)
            break
        case 'community':
            return communityCreator(user, body)
            break
        case 'report':
            return reportCreator(user, body)
            break
    }
    const error = {
        statusCode: 400,
        message: 'Missing data'
    }
    throw error
}


async function datoCreate(req, res, UserAuth) {
    const item = await itemCreator(UserAuth, req.body)
    return res.status(201)
        .json(
            await datocms
                .items
                .create(item)
        )
}

async function datoUnpublish(req, res, UserAuth) {
    const itemId = req.body.id
    if (!itemId) {
        return res.status(400).json({ error: 'Missing item id' })
    }

    const item = await datocms.item.find(itemId)
    if (item.error) {
        return res.status(400).json(item.error)
    }

    if (item.authorId == UserAuth.gitHubUserId || item.receiverId == UserAuth.gitHubUserId) {
        const itemUnpublished = await datocms.items.unpublish(item.id)
        return res.status(200).json(itemUnpublished)
    }

    return res.status(403).json({ error: 'Not authorized' })
}

async function testimonialCreator(user, body) {
    const author = user.login
    const authorId = user.id
    if (!author || !authorId) {
        const error = {
            statusCode: 403,
            message: 'Not authorized'
        }
        throw error
    }

    const receiver = body.receiver.toString()
    if (!receiver) {
        const error = {
            statusCode: 400,
            message: 'Missing receiver'
        }
        throw error
    }

    const githubUserReceiver = await UsersGithubAPI(receiver)
    const receiver_id = githubUserReceiver.id

    const text = body.text.toString()
    if (!text) {
        const error = {
            statusCode: 400,
            message: 'Missing text'
        }
        throw error
    }

    return {
        itemType: TESTIMONIALS_ITEM_TYPE,
        author: author,
        authorId: authorId,
        receiver: receiver,
        receiverId: receiver_id,
        text: text
    }
}

async function communityCreator(user, body) {
    const author = user.login
    const authorId = user.id
    if (!author || !authorId) {
        const error = {
            statusCode: 403,
            message: 'Not authorized'
        }
        throw error
    }

    const title = body.title.toString()
    if (!title) {
        const error = {
            statusCode: 400,
            message: 'Missing title'
        }
        throw error
    }

    const imageUrl = body.imageUrl.toString()
    if (!imageUrl) {
        const error = {
            statusCode: 400,
            message: 'Missing imageUrl'
        }
        throw error
    }

    return {
        itemType: COMMUNITIES_ITEM_TYPE,
        creatorSlug: author,
        creatorId: authorId,
        title: title,
        imageUrl: imageUrl,
    }
}

async function reportCreator(user, body) {
    const authorId = user.gitHubUserId
    if (!authorId) {
        const error = {
            statusCode: 403,
            message: 'Not authorized'
        }
        throw error
    }

    const itemId = body.reportedId
    if (!itemId) {
        const error = {
            statusCode: 400,
            message: 'Missing item reported'
        }
        throw error
    }
    const text = body.text

    return {
        itemType: REPORTS_ITEM_TYPE,
        authorId: authorId,
        postid: itemId,
        text: text
    }
}