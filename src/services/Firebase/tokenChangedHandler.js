const tokenChangedHandler = async (authUser) => {

    const LOGIN_API_ENDPOINT = '/api/login'
    const LOGOUT_API_ENDPOINT = '/api/logout'

    const loginAPIEndpoint = LOGIN_API_ENDPOINT
    const logoutAPIEndpoint = LOGOUT_API_ENDPOINT
    const auxCookieName = process.env.NEXT_PUBLIC_APP_NAME + '.AuthUserAux'

    const setCookie = function (key, cvalue, maxAge) {
        const expireDate = new Date(maxAge);
        document.cookie = key + "=" + cvalue + ";path=/" +
            ";expires=" + expireDate.toUTCString();
    }

    const getCookie = function (cname) {
        const name = cname + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    const cValue = getCookie(auxCookieName)

    if (authUser.email) {
        const idToken = await authUser.firebaseUser.getIdTokenResult()
        const expTime = idToken.expirationTime
        setCookie(auxCookieName, expTime, expTime)

        if (cValue !== expTime) {
            const response = await fetch(loginAPIEndpoint, {
                method: 'POST',
                headers: {
                    Authorization: idToken.token,
                },
                credentials: 'include',
            })
            if (!response.ok) {
                setCookie(auxCookieName, "", -1)
                const responseJSON = await response.json()
                throw new Error(
                    `Received ${response.status
                    } response from login API endpoint: ${JSON.stringify(responseJSON)}`
                )
            }
        }
    } else if (cValue !== "unauth") {
        setCookie(auxCookieName, "unauth")
        const response = await fetch(logoutAPIEndpoint, {
            method: 'POST',
            credentials: 'include',
        })
        if (!response.ok) {
            const responseJSON = await response.json()
            throw new Error(
                `Received ${response.status
                } response from logout API endpoint: ${JSON.stringify(responseJSON)}`
            )
        }
    }
}

export default tokenChangedHandler