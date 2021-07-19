import { SiteClient } from 'datocms-client'
import { verifyIdToken } from 'next-firebase-auth'
import jwt from 'jsonwebtoken'
import initFirebase from '../../services/Firebase/initFirebase'
import { UserGithubAPI } from '../../services/Github/github'

initFirebase()

const DATO_TOKEN = process.env.DATO_FULL_ACCESS_TOKEN;

export default async function recebedorDeRequests(req, res) {

    if (!(req.headers && req.headers.authorization)) {
        return res.status(400).json({ error: 'Missing Authorization header value' })
    }
    const token = req.headers.authorization

    if (req.method === 'POST') {
        try {
            await verifyIdToken(token)
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e)
            return res.status(403).json({ error: 'Not authorized' })
        }

        // const decodedToken = jwt.decode(token);
        const { identities } = jwt.decode(token).firebase;
        const githubUserID = identities['github.com'][0];

        try {
            const githubUserAuth = await UserGithubAPI(githubUserID)
            const client = new SiteClient(DATO_TOKEN);

            // Validar os dados, antes de sair cadastrando
            const registroCriado = await client.items.create({
                itemType: "976594", // ID do Model criado pelo Dato
                author: githubUserAuth.login,
                ...req.body,
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