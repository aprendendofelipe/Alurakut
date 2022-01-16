import { useEffect, useState } from 'react'
import { PageSubtitle } from '../../../components/Head'
import { useRouter } from 'next/dist/client/router';
import MainGrid from '../../../components/MainGrid'
import Box from '../../../components/Box'
import { AlurakutMenu, OrkutNostalgicIconSet } from '../../../lib/AlurakutCommons'
import ProfileRelationsBoxWrapper from '../../../components/ProfileRelations'
import ProfileSidebar from '../../../components/ProfileSidebar'
import { getUserCommunities } from '../../../services/Dato/Communities'
import TestimonialsBoxWrapper from '../../../components/Testimonials'
import { pessoasFavoritasOBJList } from '../../../utils/topUsers'
import { getServerProps } from '../../../services/Vercel/serverside';
import { useGitHubUserAPI } from '../../../core/hooks';

const Profile = (props) => {

  const userProfile = useGitHubUserAPI(props.userProfile.id, props.userProfile)
  const [comunidades, setComunidades] = useState([])
  const [countComunidades, setCountComunidades] = useState(0)

  const router = useRouter()

  useEffect(() => {
    const getAllCommunities = async () => {

      const { communities, countCommunities } = await getUserCommunities(userProfile.login);

      const comunidadesOBJList = communities?.map((community) => {
        return {
          name: community.title,
          key: community.id,
          href: `/communities`,
          imgSRC: community.imageUrl
        }
      })
      setComunidades(comunidadesOBJList);
      setCountComunidades(countCommunities);

    }

    getAllCommunities()

  }, [router, userProfile])

  return (
    <>
      <PageSubtitle>
        {userProfile.login}
      </PageSubtitle>
      <AlurakutMenu
        loginGithub={userProfile}
      />
      <MainGrid>
        {/* <Box style="grid-area: profileArea;"> */}
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar
            loginGithub={userProfile}
          />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              {userProfile.login}
            </h1>
            <p>
              {userProfile.bio}
            </p>

            <OrkutNostalgicIconSet />
          </Box>
          <TestimonialsBoxWrapper
            userProfile={userProfile}
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

export async function getStaticProps({ params }) {
  return {
    ...await getServerProps({ uid: '', login: params.user }),
    revalidate: 5
  }
}

export async function getStaticPaths() {
  const paths = []

  return {
    paths,
    fallback: 'blocking'
  }
}

export default Profile