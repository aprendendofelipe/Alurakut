import initFirebase from '../services/Firebase/initFirebase';
import { createGlobalStyle, ThemeProvider } from 'styled-components'
import { AlurakutStyles } from '../lib/AlurakutCommons'
import { Head_app } from '../components/Head'

const GlobalStyle = createGlobalStyle`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    :root {
    --backgroundPrimary: #D9E6F6;
    --colorPrimary: #2E7BB4;
    --textPrimaryColor: #333333;

    --backgroundSecondary: #fcfdff;
    --colorSecondary: #388BB0;
    --textSecondaryColor: #D81D99;

    --backgroundTertiary: #FFFFFF;
    --colorTertiary: #2F4A71;
    --textTertiaryColor: #5A5A5A;

    --backgroundQuarternary: #BBCDE8;
    --colorQuarternary: #D81D99;
    --textQuarternaryColor: #FFFFFF;

    --commonRadius: 8px;
  }

  body {
    font-family: sans-serif;
    background-color: var(--backgroundPrimary);
  }

  #__next {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  ${AlurakutStyles}
`

const theme = {
  colors: {
    primary: 'red',
  },
}

initFirebase();

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head_app />
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}
