import { SiteClient as datocms } from 'datocms-client'
import { verifyAuthorization } from '../../core/apis_server_side'

const DATO_TOKEN = process.env.DATO_FULL_ACCESS_TOKEN

async function datoCreate(req, res, itemCreator) {
    try {
        const UserAuth = await verifyAuthorization(req)
        res.status(201).json(
            await datocms(DATO_TOKEN)
                .items
                .create(itemCreator(UserAuth, req.body))
        )
        return
    } catch (error) {
        return res.status(error.statusCode).json(error)
    }
}

async function datoUnpublish(req, res, validator) {
    try {
        const UserAuth = await verifyAuthorization(req)
        const item = validator(UserAuth, req.body)
        if (item.error) {
            throw new item.error
        }
        return res.status(201).json(
            await datocms(DATO_TOKEN)
                .items
                .unpublish(item.id)
        )
    } catch (error) {
        return res.status(error.statusCode).json(error)
    }
}

export async function datoReqs(req, res, postValidator, deleteValidator) {

    if (req.method === 'POST') {
        return await datoCreate(req, res, postValidator)

    } else if (req.method === 'DELETE') {
        return await datoUnpublish(req, res, deleteValidator)
    }

    return res.status(404).json({ message: 'invalid method' })
}
