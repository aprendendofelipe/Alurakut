const APIconfig = {
    name: process.env.NEXT_PUBLIC_APP_NAME,
    keys: [
        process.env.COOKIE_SECRET_CURRENT,
        process.env.COOKIE_SECRET_PREVIOUS,
    ],
    httpOnly: true,
    maxAge: parseInt(process.env.NEXT_PUBLIC_COOKIE_MAX_AGE, 10),
    overwrite: true,
    path: '/',
    sameSite: 'strict',
    secure: process.env.NEXT_PUBLIC_COOKIE_SECURE === 'true',
    signed: true,
}

export default APIconfig