import { useEffect, useState } from 'react'
import { PageSubtitle } from './Head'
import { useRouter } from 'next/dist/client/router'
import MainGrid from './MainGrid'
import Box from './Box'
import { AlurakutMenu } from '../lib/AlurakutCommons'
import ProfileRelationsBoxWrapper from './ProfileRelations'
import ProfileSidebar from './ProfileSidebar'
import { getUserCommunities } from '../services/Dato/Communities'
import TestimonialsBoxWrapper from './Testimonials'
import { pessoasFavoritasOBJList } from '../utils/topUsers'
import { useGitHubUserAPI } from '../core/hooks'
import UserStats, { TopLangs } from './UserStats'

export default function UserProfile({ UserProfileProps }) {
    const userProfile = useGitHubUserAPI(UserProfileProps.userProfile.id, UserProfileProps.userProfile)
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
                    </Box>
                    <Box>
                        <UserStats username={userProfile.login} />
                    </Box>
                    <TestimonialsBoxWrapper
                        userProfile={userProfile}
                        list={UserProfileProps.testimonials}
                    />
                </div>
                <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
                    {/* <ProfileRelationsBoxWrapper title="Seguidores" list={seguidores} /> */}

                    <Box>
                        <TopLangs username={userProfile.login} />
                    </Box>
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