import { useEffect, useState } from 'react'
import { PageSubtitle } from '../components/Head'
import {
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction
} from 'next-firebase-auth'
import jwt from 'jsonwebtoken'
import MainGrid from '../components/MainGrid'
import Box from '../components/Box'
import { AlurakutMenu, OrkutNostalgicIconSet } from '../lib/AlurakutCommons'
import ProfileRelationsBoxWrapper from '../components/ProfileRelations'
import ProfileSidebar from '../components/ProfileSidebar'
import { getUserCommunities } from '../services/Dato/Communities'
import { pessoasFavoritasOBJList } from '../utils/topUsers'
import TestimonialsBoxWrapper from '../components/Testimonials'
import { getServerProps } from '../services/Vercel/serverside'
import { useGitHubUserAPI, useLoggedUser } from '../core/hooks'
import { NewCommunityBox } from '../components/Communities'

const Home = (props) => {
  const loggedUser = useLoggedUser(props.userProfile)
  const gitHubUser = useGitHubUserAPI(loggedUser?.gitHubUserId, props.userProfile)
  const userName = gitHubUser.name || loggedUser?.displayName || gitHubUser.login
  const [comunidades, setComunidades] = useState([])
  const [countComunidades, setCountComunidades] = useState(0)


  useEffect(() => {
    const getCommunities = async () => {

      const { communities, countCommunities } = await getUserCommunities(gitHubUser.login);

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
  }, [])

  return (
    <>
      <PageSubtitle>
        {gitHubUser.login}
      </PageSubtitle>
      <AlurakutMenu
        loginGithub={gitHubUser}
      />
      <MainGrid>
        {/* <Box style="grid-area: profileArea;"> */}
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar
            loginGithub={gitHubUser}
          />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              {`Bem vindo(a), ${userName}`}
            </h1>
            <p>
              {props.userProfile.bio}
            </p>

            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">Encontre usuários pela barra de pesquisa.</h2>
            <h2 className="subTitle">Escreva seu depoimento nas páginas dos amigos.</h2>
            <h2 className="subTitle">Convide seus amigos para ver seu depoimento no perfil deles.</h2>
          </Box>

          <NewCommunityBox />
          <TestimonialsBoxWrapper
            userProfile={gitHubUser}
            list={props.testimonials}
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
  const { AuthUser, req } = ctx
  const token = await AuthUser.getIdToken()
  const { identities } = jwt.decode(token).firebase
  const loggedGitHubUserID = identities['github.com'][0]

  return await getServerProps({ uid: loggedGitHubUserID, login: '' })
})

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Home)