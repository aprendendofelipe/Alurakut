import { verifyIdToken } from 'next-firebase-auth'
import { SiteClient } from 'datocms-client'
import initFirebase from '../../services/Firebase/initFirebase'
import getIdGitHubUserAuth from '../../services/Firebase/github_firebase'

initFirebase()

const REPORTS_ITEM_TYPE = "1356689"
const DATO_TOKEN = process.env.DATO_FULL_ACCESS_TOKEN

export default async function recebedorDeRequests(req, res) {
    try {
        if (!(req.headers && req.headers.authorization)) {
            return res.status(400).json({ error: 'Missing Authorization header value' })
        }

        const token = req.headers.authorization
        await verifyIdToken(token)

        const client = new SiteClient(DATO_TOKEN)
        const githubUserID = getIdGitHubUserAuth(token)

        if (!githubUserID) {
            return res.status(403).json({ error: 'Not authorized' })
        }

        if (req.method === 'POST') {
            const itemId = req.body.itemId
            const text = req.body.text
            const recordCreated = await client.items.create({
                itemType: REPORTS_ITEM_TYPE,
                authorId: githubUserID,
                postid: itemId,
                text: text
            })
            res.status(201).json(recordCreated)
            return

        } else if (req.method === 'DELETE') {
            const itemId = req.body.reportId
            const item = await client.item.find(itemId)
            if (item.authorId == githubUserID) {
                const deletedItem = await client.item.destroy(itemId)
                res.status(201).json(deletedItem)
                return
            }
            return res.status(403).json({ error: 'Not authorized' })
        }

        res.status(404).json({
            message: 'Ainda não temos nada no GET'
        })
    } catch (error) {
        return res.status(error.statusCode).json({ error: error.message })
    }
}