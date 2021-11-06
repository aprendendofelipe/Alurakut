import { datoReqs } from '../../services/Dato/ServerSide'

export default async function requestsAcceptor(req, res) {
    return datoReqs(req, res)
}