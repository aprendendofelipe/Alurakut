import NextHead from 'next/head';

export function Head_app() {
    return (
        <NextHead>
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="manifest" href="/site.webmanifest" />
        </NextHead>
    )
}

export function HeadTitle({ children }) {
    return (
        <NextHead>
            <title>
                {children}
            </title>
        </NextHead>
    )
}

export default NextHead