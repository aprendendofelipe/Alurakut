import { verifyIdToken } from 'next-firebase-auth'
import APIconfig from './APIconfig'
import { getCookie, getAuthUserTokensCookieName } from './cookies'

const { keys, secure, signed } = APIconfig

const srvAuthUser = async (req, res) => {
    const cookieValStr = getCookie(
        getAuthUserTokensCookieName(),
        { req, res },
        { keys, secure, signed }
    )

    const { idToken, refreshToken } = cookieValStr
        ? JSON.parse(cookieValStr)
        : {}

    let AuthUser
    if (idToken) {
        AuthUser = await verifyIdToken(idToken, refreshToken)
    }

    return AuthUser
}

export default srvAuthUser