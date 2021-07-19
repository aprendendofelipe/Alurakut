import { useEffect, useState } from 'react'
import Head from 'next/head'
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
import { getUserCommunities } from '../services/Dato/Dato'
import { pessoasFavoritasOBJList } from '../utils/topUsers'
import { handleCriaComunidade } from '../services/Dato/Communities'
import TestimonialsBoxWrapper from '../components/Testimonials'
import { getTestemonials } from '../services/Dato/Dato'

const Home = (props) => {
  const loginGithub = props.loggedGithubUser.login
  const userLoggedImageSRC = props.loggedGithubUser.avatar_url
  const [comunidades, setComunidades] = useState([])
  const [countComunidades, setCountComunidades] = useState(0)
  const [testimonials, setTestimonials] = useState([]);
  const [countTestimonials, setCountTestimonials] = useState(0);

  // const [seguidores, setSeguidores] = useState([])
  // 0 - Pegar o array de dados do github 
  useEffect(() => {
    const getCommunities = async () => {
      // GET
      // fetch(props.loggedGithubUser.followers_url)
      //   .then(function (respostaDoServidor) {
      //     return respostaDoServidor.json();
      //   })
      //   .then(function (respostaCompleta) {
      //     setSeguidores(respostaCompleta);
      //   })

      const { communities, countCommunities } = await getUserCommunities(loginGithub);

      const comunidadesOBJList = communities?.map((community) => {
        return {
          name: community?.title,
          key: community?.id,
          href: `/communities`,
          imgSRC: community?.imageUrl
        }
      })
      setComunidades(comunidadesOBJList);
      setCountComunidades(countCommunities);

    }
    getCommunities()

    setTestimonials(
      props.testimonials.testimonials.map((item) => {
        return {
          name: item.author,
          key: item.id,
          href: `/users/${item.author}`,
          imgSRC: `https://github.com/${item.author}.png`,
          text: item.text
        }
      }))
    setCountTestimonials(props.testimonials.countTestimonials)

  }, [])


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
            <p>
              {props.loggedGithubUser.bio}
            </p>

            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">Pesquise outros usuários pela barra de pesquisa.</h2>
            <h2 className="subTitle">Escreva seu depoimento no perfil que quiser.</h2>
            <h2 className="subTitle">Convide seus amigos para ver seu depoimento no perfil deles.</h2>
          </Box>
          <Box>
            <h2 className="subTitle">Crie novas comunidades.</h2>
            <form onSubmit={(e) => handleCriaComunidade(e, loginGithub)}>
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
          <TestimonialsBoxWrapper
            loginGithub={loginGithub}
            count={countTestimonials}
            list={testimonials}
          />
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

  const testimonials = await getTestemonials(loggedGithubUser.login)

  return {
    props: {
      loggedGithubUser,
      testimonials
    },
  }
})

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Home)