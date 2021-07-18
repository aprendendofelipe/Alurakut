import { useEffect, useState } from 'react'
import Head from 'next/head';
import jwt from 'jsonwebtoken'
import MainGrid from '../components/MainGrid'
import Box from '../components/Box'
import { AlurakutMenu, OrkutNostalgicIconSet } from '../lib/AlurakutCommons'
import ProfileRelationsBoxWrapper from '../components/ProfileRelations'
import {
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
  useAuthUser,
} from 'next-firebase-auth'
import ProfileSidebar from '../components/ProfileSidebar'
import { UserGithubAPI } from '../services/Github/github'
import { getUserCommunities } from '../services/Dato/DatoAlura'
import { pessoasFavoritasOBJList } from '../utils/topUsers'

const Home = (props) => {
  const loginGithub = props.loggedGithubUser.login
  const userLoggedImageSRC = props.loggedGithubUser.avatar_url
  const [comunidades, setComunidades] = useState([])
  const [countComunidades, setCountComunidades] = useState(0)

  // const [seguidores, setSeguidores] = useState([])
  // 0 - Pegar o array de dados do github 
  useEffect(() => {
    const getAllCommunities = async () => {
      // GET
      // fetch(props.loggedGithubUser.followers_url)
      //   .then(function (respostaDoServidor) {
      //     return respostaDoServidor.json();
      //   })
      //   .then(function (respostaCompleta) {
      //     setSeguidores(respostaCompleta);
      //   })

      const { communities, countCommunities } = await getUserCommunities(loginGithub);

      const comunidadesOBJList = communities.map((community) => {
        return {
          name: community?.title,
          key: community?.id,
          href: `/communities/${community?.id}`,
          imgSRC: community?.imageUrl
        }
      })
      setComunidades(comunidadesOBJList);
      setCountComunidades(countCommunities);

    }
    getAllCommunities()
  }, [])

  function handleCriaComunidade(e) {
    e.preventDefault();
    const dadosDoForm = new FormData(e.target);

    const comunidade = {
      title: dadosDoForm.get('title'),
      imageUrl: dadosDoForm.get('image'),
      creatorSlug: loginGithub,
    }

    fetch('/api/comunidades', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(comunidade)
    })
      .then(async (response) => {
        const dados = await response.json();
        console.log(dados.registroCriado);
        const comunidade = dados.registroCriado;
        const comunidadesAtualizadas = [...comunidades, comunidade];
        setComunidades(comunidadesAtualizadas)
      })
  }

  return (
    <>
      <Head>
        <title>{`Alurakut | ${loginGithub}`}</title>
      </Head>
      <AlurakutMenu
        loginGithub={loginGithub}
        logout={useAuthUser().signOut}
        userLoggedImageSRC={userLoggedImageSRC}
      />
      <MainGrid>
        {/* <Box style="grid-area: profileArea;"> */}
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar
            loginGithub={loginGithub}
            logout={useAuthUser().signOut}
            userLoggedImageSRC={userLoggedImageSRC}
          />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              {`Bem vindo(a), ${loginGithub}`}
            </h1>

            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={(e) => handleCriaComunidade(e)}>
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                />
              </div>

              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          {/* <ProfileRelationsBoxWrapper title="Seguidores" list={seguidores} /> */}

          <ProfileRelationsBoxWrapper
            title="Pessoas da comunidade"
            list={pessoasFavoritasOBJList}
            count={pessoasFavoritasOBJList.length}
          />
          <ProfileRelationsBoxWrapper
            title="Comunidades"
            list={comunidades}
            count={countComunidades}
          />
        </div>
      </MainGrid>
    </>
  )
}

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async (ctx) => {
  const { AuthUser, req } = ctx;
  const token = await AuthUser.getIdToken()
  const { identities } = jwt.decode(token).firebase;
  const loggedGithubUserID = identities['github.com'][0];

  const loggedGithubUser = await UserGithubAPI(loggedGithubUserID);

  return {
    props: {
      loggedGithubUser,
    },
  }
})

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Home)