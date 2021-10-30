import { withAuthUser, AuthAction } from 'next-firebase-auth'
import FirebaseAuth from '../components/FirebaseAuth'
import Head from 'next/head'
import Link from '../utils/Link'

const LoginPage = () => {
  return (
    <>
      <Head>
        <title>Alurakut | Login</title>
      </Head>
      <main style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <div className="loginScreen">
          <section className="logoArea">
            <img src="/logo.svg" />

            <p><strong>Conecte-se</strong> aos seus amigos desenvolvedores de deixe seus depoimentos</p>
            <p><strong>Conheça</strong> novas pessoas através de amigos de seus amigos e comunidades</p>
            <p><strong>Compartilhe</strong> seus projetos em um só lugar</p>
          </section>

          <section className="formArea">
            <div className="box">
              <p>
                Acesse agora mesmo com seu usuário do <strong>GitHub</strong>!
              </p>
              <br />
              <FirebaseAuth />
            </div>

            <footer className="box">
              <p>
                Ainda não é membro? <br />
                <Link href="/users/aprendendofelipe">
                  <strong>
                    ENTRAR JÁ
                  </strong>
                </Link>
              </p>
            </footer>
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
      </main>
    </>
  )
}

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.RENDER,
})(LoginPage)