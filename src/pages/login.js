import { withAuthUser, AuthAction } from 'next-firebase-auth'
import styled from 'styled-components'
import FirebaseAuth from '../components/FirebaseAuth'
import { PageSubtitle } from '../components/Head'
import Link from '../utils/Link'

const LoginPage = () => {
  return (
    <>
      <PageSubtitle>
        Login
      </PageSubtitle>
      <LoginScreen>
        <div className='loginScreen'>
          <section className="logoArea">
            <img src="/logo.svg" />
            <p><strong>Conecte-se</strong> aos seus amigos desenvolvedores.</p>
            <p><strong>Pesquise</strong> outros usuários pela barra de pesquisa.</p>
            <p><strong>Escreva</strong> seu depoimento no perfil que quiser.</p>
            <p><strong>Convide</strong> seus amigos para ver seu depoimento.</p>
          </section>

          <section className="loginArea">
            <div className="box">
              <p>
                Acesse agora mesmo com seu usuário do <strong>GitHub</strong>!
              </p>
              <div className='buttonPlaceholder'>
                <FirebaseAuth newButtonText={"Entrar com GitHub"} />
              </div>
            </div>
          </section>

          <section className="guestArea">
            <div className="box">
              <p>
                Ainda não é membro? <br />
              </p>
              <Link href="/users/aprendendofelipe">
                <button>
                  <span>
                    <img src="/github_sunglasses.svg" />
                  </span>
                  <strong className='bt-text-long'>
                    Entrar como Visitante
                  </strong>
                  <strong className='bt-text-short'>
                    Visitar
                  </strong>
                </button>
              </Link>

            </div>
          </section>

          <footer className="footerArea">
            <p>
              <a href="https://www.alura.com.br/" target="_blank">
                © 2021 alura.com.br</a> - <a
                  href="https://github.com/aprendendofelipe/alurakut" target="_blank"
                >Sobre o Alurakut.br</a> - <a
                  href="https://github.com/aprendendofelipe/alurakut" target="_blank"
                >Centro de segurança</a> - <a
                  href="https://github.com/aprendendofelipe/alurakut" target="_blank"
                >Privacidade</a> - <a
                  href="https://github.com/aprendendofelipe/alurakut" target="_blank"
                >Termos</a> - <Link
                  href="https://www.linkedin.com/in/felipe-soares/" target="_blank"
                >Contato</Link>
            </p>
          </footer>
        </div>
      </LoginScreen>
    </>
  )
}

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.RENDER,
})(LoginPage)

const LoginScreen = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 16px;

  button {
    display: grid;
    grid-template-columns: 18px 1fr;
    border: 0;
    padding: 12px;
    min-width: 110px;
    min-height: 44px;
    border-radius: var(--commonRadius);
    background-color: var(--colorQuarternary);
    color: var(--textQuarternaryColor);
    font-size: 14px;
    font-family: Roboto,Helvetica,Arial,sans-serif;
    box-shadow: 
      0 2px 2px 0 rgb(0 0 0 / 14%),
      0 3px 1px -2px rgb(0 0 0 / 20%),
      0 1px 5px 0 rgb(0 0 0 / 12%);
    transition: .2s;
    @media(min-width: 268px) {
      min-width: 200px;
    }
  }

  a {
    text-decoration: none;
    color: var(--colorPrimary);
  }

  .loginScreen {
    max-width: 1110px;
    display: grid;
    --gap: 12px;
    --gutter: 16px;
    grid-gap: var(--gap);
    grid-template-areas: 
      "logoArea"
      "loginArea"
      "guestArea"
      "footerArea";
    @media(min-width: 780px) {
      grid-template-columns: 2fr 1fr;
      grid-template-areas:
              "logoArea loginArea"
              "logoArea guestArea"
              "footerArea footerArea";
    }

    .box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding-top: var(--gutter);
        padding-bottom: var(--gutter);
        padding-left: 24px;
        padding-right: 24px;
        background-color: var(--backgroundSecondary);
        border-radius: var(--commonRadius);
        flex: 1;
        box-shadow: 0px 0px 2px #33333357;
        p {
          font-size: 14px;
        }
      }

    .logoArea {
      grid-area: logoArea;
      background-color: var(--backgroundSecondary);
      border-radius: var(--commonRadius);
      padding: var(--gutter);
      text-align: center;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      min-height: 263px;
      box-shadow: 0px 0px 2px #33333357;
      @media(min-height: 390px) and (min-width: 780px) {
        min-height: 320px;
      }
      p {
        font-size: 12px;
        line-height: 1.2;
        &:not(:last-child) {
          margin-bottom: 12px;
        }
        strong {
          color: var(--colorQuarternary);
        }
      }
      img {
        max-height: 60px;
        margin-bottom: 36px;
      }
    }

    .loginArea {
      grid-area: loginArea;
      display: flex;
    }

    .buttonPlaceholder{
      height: 76px;
    }

    .guestArea {
      grid-area: guestArea;
      display: flex;
      button {
        margin: 16px 24px;
      }
      strong {
        padding-left: 16px;
      }
    }
    .bt-text-long{
      display: table-cell;
    }
    .bt-text-short{
      display: none;
    }
    @media(max-width: 268px) {
      .bt-text-long{
        display: none;
      }
      .bt-text-short{
        display: table-cell;
      }
    } 

    .footerArea {
      grid-area: footerArea;
      background-color: var(--backgroundQuarternary);
      border-radius: var(--commonRadius);
      padding: 8px;
      box-shadow: 0px 0px 2px #33333357;
      p {
        font-size: 12px;
        text-align: center;
      }
    }
  }
`;