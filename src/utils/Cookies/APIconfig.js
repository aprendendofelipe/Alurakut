const TWELVE_DAYS_IN_MS = 1036800000;

const APIconfig = {
    name: process.env.NEXT_PUBLIC_APP_NAME,
    keys: [
        process.env.COOKIE_SECRET_CURRENT,
        process.env.COOKIE_SECRET_PREVIOUS,
    ],
    httpOnly: true,
    maxAge: TWELVE_DAYS_IN_MS,
    overwrite: true,
    path: '/',
    sameSite: 'strict',
    secure: process.env.NEXT_PUBLIC_COOKIE_SECURE === 'true',
    signed: true,
}

export default APIconfig