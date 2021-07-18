// https://github.com/pillarjs/cookies
import Cookies from 'cookies'
import APIconfig from './APIconfig'
import { encodeBase64, decodeBase64 } from './encoding'

const getBaseCookieName = APIconfig.name

export const getAuthUserCookieName = () => {
    const baseAuthCookieName = getBaseCookieName
    return `${baseAuthCookieName}.AuthUser`
}

export const getAuthUserTokensCookieName = () => {
    const baseAuthCookieName = getBaseCookieName
    return `${baseAuthCookieName}.AuthUserTokens`
}

export const getGithubUserTokensCookieName = () => {
    return `dotcom_user`
}


const createCookieMgr = ({ req, res }, { keys, secure } = {}) => {
    // https://github.com/pillarjs/cookies
    const cookies = Cookies(req, res, {
        keys,
        secure,
    })
    return cookies
}

export const getCookie = (
    name,
    { req, res },
    { keys, secure, signed } = {}
) => {
    if (signed && !keys) {
        throw new Error(
            'The "keys" value must be provided when using signed cookies.'
        )
    }

    const cookies = createCookieMgr({ req, res }, { keys, secure })

    // https://github.com/pillarjs/cookies#cookiesget-name--options--
    const cookieVal = cookies.get(name, { signed })
    return cookieVal ? decodeBase64(cookieVal) : undefined
}

export const setCookie = (
    name,
    cookieVal,
    { req, res },
    {
        keys,
        domain,
        httpOnly,
        maxAge,
        overwrite,
        path,
        sameSite,
        secure,
        signed,
    } = {}
) => {
    if (signed && !keys) {
        throw new Error(
            'The "keys" value must be provided when using signed cookies.'
        )
    }

    const cookies = createCookieMgr({ req, res }, { keys, secure })

    // If the value is not defined, set the value to undefined
    // so that the cookie will be deleted.
    const valToSet = cookieVal == null ? undefined : encodeBase64(cookieVal)

    // https://github.com/pillarjs/cookies#cookiesset-name--value---options--
    cookies.set(name, valToSet, {
        domain,
        httpOnly,
        maxAge,
        overwrite,
        path,
        sameSite,
        secure,
        signed,
    })
}

// Some options, like path and domain, must match those used when setting
// the cookie.
export const deleteCookie = (name, reqResObj, options) => {
    // "If the value is omitted, an outbound header with an expired
    // date is used to delete the cookie."
    // https://github.com/pillarjs/cookies#cookiesset-name--value---options--
    setCookie(name, undefined, reqResObj, options)
}
