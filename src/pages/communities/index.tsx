import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/dist/client/router';
import MainGrid from '../../components/MainGrid'
import Box from '../../components/Box'
import { AlurakutMenu, OrkutNostalgicIconSet } from '../../lib/AlurakutCommons'
import ProfileRelationsBoxWrapper from '../../components/ProfileRelations'
import ProfileSidebar from '../../components/ProfileSidebar'
import { getAllCommunities, getUserCommunities } from '../../services/Dato/Dato'
import { pessoasFavoritasOBJList } from '../../utils/topUsers'
import { handleCriaComunidade } from '../../services/Dato/Communities'
import AllCommunitiesBoxWrapper from '../../components/AllCommunities';
import { useGitHubUserAPI, useLoggedUser } from '../../core/hooks';

const Communities = (props) => {
    const loggedUser = useLoggedUser()
    const gitHubUser = useGitHubUserAPI(loggedUser?.gitHubUserId, {})
    const [comunidades, setComunidades] = useState([])
    const [countComunidades, setCountComunidades] = useState(0)

    const router = useRouter()

    useEffect(() => {
        const getCommunities = async () => {
            const { communities, countCommunities } = await getUserCommunities(gitHubUser.login);

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
        if (gitHubUser?.login) {
            getCommunities()
        }

    }, [router, gitHubUser])

    // async function getMoreCommunities(communitiesNames: string[]) {
    //     await getAllCommunities(communitiesNames.length, communitiesNames)

    // }

    return (
        <>
            <Head>
                <title>Alurakut | Comunidades</title>
            </Head>
            <AlurakutMenu
                loginGithub={gitHubUser}
            />
            <MainGrid>
                <div className="profileArea" style={{ gridArea: 'profileArea' }}>
                    <ProfileSidebar
                        loginGithub={gitHubUser}
                    />
                </div>
                <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
                    <Box>
                        <h1 className="title">Comunidades</h1>

                        <OrkutNostalgicIconSet />
                    </Box>

                    <Box>
                        <h2 className="subTitle">Crie novas comunidades.</h2>
                        <form onSubmit={(e) => handleCriaComunidade(e, gitHubUser.login, comunidades, token, setComunidades)}>
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

                    <AllCommunitiesBoxWrapper
                        title="Todas as Comunidades"
                        list={props.allCommunities}
                        count={props.countAllCommunities}
                    />
                    <AllCommunitiesBoxWrapper
                        title="Todas as Comunidades no Dato da Alura"
                        list={props.allCommunitiesAlura}
                        count={props.countAllCommunitiesAlura}
                    />
                </div>
                <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>

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

export async function getStaticProps() {

    const firstsCommunities = await getAllCommunities()

    const allCommunities = firstsCommunities?.communities
        ? firstsCommunities.communities.map((community) => {
            return {
                name: community.title,
                key: community.id,
                href: `/communities`,
                imgSRC: community.imageUrl
            }
        })
        : []

    const allCommunitiesAlura = firstsCommunities?.aluraCommunities
        ? firstsCommunities.aluraCommunities.map((community) => {
            return {
                name: community.title,
                key: community.id,
                href: `/communities`,
                imgSRC: community.imageUrl
            }
        })
        : []

    const countAllCommunities = firstsCommunities.countCommunities || 0
    const countAllCommunitiesAlura = firstsCommunities.countCommunitiesAlura || 0

    return {
        props: {
            allCommunities,
            allCommunitiesAlura,
            countAllCommunities,
            countAllCommunitiesAlura
        },
        revalidate: 900,
    }
}



export default Communities