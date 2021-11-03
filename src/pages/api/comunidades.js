import { verifyIdToken } from 'next-firebase-auth'
import { SiteClient } from 'datocms-client'
import { getGitHubUserAuth } from '../../services/Github/github'
import initFirebase from '../../services/Firebase/initFirebase'

initFirebase()

const COMMUNITIES_ITEM_TYPE = "980113" // ID do Model de "Communities" criado pelo Dato
const DATO_TOKEN = process.env.DATO_FULL_ACCESS_TOKEN

export default async function recebedorDeReqs(req, res) {
    if (!(req.headers && req.headers.authorization)) {
        return res.status(400).json({ error: 'Missing Authorization header value' })
    }

    const token = req.headers.authorization
    try {
        await verifyIdToken(token)
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e)
        return res.status(403).json({ error: 'Not authorized' })
    }

    const client = new SiteClient(DATO_TOKEN);
    const githubUserAuth = await getGitHubUserAuth(token)

    if (!githubUserAuth?.login) {
        return res.status(403).json({ error: 'Not authorized' })
    }

    if (req.method === 'POST') {
        try {

            // Validar os dados, antes de sair cadastrando
            const registroCriado = await client.items.create({
                itemType: COMMUNITIES_ITEM_TYPE,
                ...req.body,
                // title: "Comunidade de Teste",
                // imageUrl: "https://github.com/omariosouto.png",
                creatorSlug: githubUserAuth.login
            })

            res.status(201).json({
                registroCriado: registroCriado,
            })
            return;

        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e)
            return res.status(503).json({ error: 'Service Unavailable' })
        }
    }

    res.status(404).json({
        message: 'Ainda não temos nada no GET, mas no POST tem!'
    })
}