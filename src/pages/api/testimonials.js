import { verifyIdToken } from 'next-firebase-auth'
import { SiteClient } from 'datocms-client'
import { getGitHubUser, UsersGithubAPI } from '../../services/Github/github'
import initFirebase from '../../services/Firebase/initFirebase'
import getIdGitHubUserAuth from '../../services/Firebase/github_firebase'

initFirebase()

const TESTIMONIALS_ITEM_TYPE = "976594" // ID do Model de "Testimonials" criado pelo Dato
const DATO_TOKEN = process.env.DATO_FULL_ACCESS_TOKEN

export default async function recebedorDeRequests(req, res) {
    try {
        if (!(req.headers && req.headers.authorization)) {
            return res.status(400).json({ error: 'Missing Authorization header value' })
        }

        const token = req.headers.authorization
        try {
            await verifyIdToken(token)
        } catch (err) {
            return res.status(403).json(err)
        }
        const client = new SiteClient(DATO_TOKEN)
        const githubUserID = getIdGitHubUserAuth(token)

        if (!githubUserID) {
            return res.status(403).json({ error: 'Not authorized' })
        }

        if (req.method === 'POST') {

            const receiver = req.body.receiver.toString()
            const githubUserAuthor = await getGitHubUser(githubUserID)
            const author = githubUserAuthor.login
            const githubUserReceiver = await UsersGithubAPI(receiver)
            const receiver_id = githubUserReceiver.id
            const text = req.body.text.toString()

            if (!author | !text | !receiver_id) {
                return res.status(403).json({ error: 'Not authorized' })
            }

            const recordCreated = await client.items.create({
                itemType: TESTIMONIALS_ITEM_TYPE,
                author: author,
                authorId: githubUserID,
                receiver: receiver,
                receiverId: receiver_id,
                text: text
            })

            res.status(201).json(recordCreated)
            return
        } else if (req.method === 'DELETE') {
            const itemId = req.body.id

            const item = await client.item.find(itemId)
            if (item.authorId == githubUserID || item.receiverId == githubUserID) {
                const deletedItem = await client.item.unpublish(itemId)
                res.status(201).json(deletedItem)
                return
            }

            return res.status(403).json({ error: 'Not authorized' })
        }

        res.status(404).json({
            message: 'Ainda não temos nada no GET'
        })
    } catch (error) {
        return res.status(error.statusCode).json(error)
    }
}