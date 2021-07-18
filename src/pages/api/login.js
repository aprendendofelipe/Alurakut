import { setAuthCookies } from 'next-firebase-auth'
import initFirebase from '../../services/Firebase/initFirebase'

initFirebase()

const handler = async (req, res) => {
  try {
    await setAuthCookies(req, res)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    return res.status(500).json({ error: 'Unexpected error.' })
  }
  return res.status(200).json({ status: true })
}

export default handler
