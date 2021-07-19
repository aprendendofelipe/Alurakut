import { useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'
import Head from 'next/head'
import { useRouter } from 'next/dist/client/router';
import MainGrid from '../../components/MainGrid'
import Box from '../../components/Box'
import { AlurakutMenu, OrkutNostalgicIconSet } from '../../lib/AlurakutCommons'
import ProfileRelationsBoxWrapper from '../../components/ProfileRelations'
import ProfileSidebar from '../../components/ProfileSidebar'
import { UserGithubAPI, UsersGithubAPI } from '../../services/Github/github'
import { getAllCommunities, getUserCommunities } from '../../services/Dato/DatoAlura'
import firebase from '../../services/Firebase/firebase'
import tokenChangedHandler from '../../services/Firebase/tokenChangedHandler'
import { pessoasFavoritasOBJList } from '../../utils/topUsers'
import { handleCriaComunidade } from '../../services/Dato/Communities'
import AllCommunitiesBoxWrapper from '../../components/AllCommunities';

const Communities = (props) => {
    const [comunidades, setComunidades] = useState([]);
    const [countComunidades, setCountComunidades] = useState(0);
    // const [token, setToken] = useState("");
    const [loginGithub, setLoginGithub] = useState("");
    const [userLoggedImageSRC, setUserLoggedImageSRC] = useState("");

    const router = useRouter()

    useEffect(() => {
        const getCommunities = async () => {
            const { communities, countCommunities } = await getUserCommunities(loginGithub);

            const comunidadesOBJList = communities.map((community) => {
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

        getCommunities()

    }, [router, loginGithub])

    async function onIdTokenChange(firebaseUser) {
        if (firebaseUser) {
            const photoURL = firebaseUser.photoURL
            setUserLoggedImageSRC(photoURL)
            const t_token = await firebase.auth().currentUser.getIdToken()
            // setToken(t_token)
            const loggedGithubUserID = await jwt.decode(t_token).firebase.identities['github.com'][0]
            const GithubUserJson = await UserGithubAPI(loggedGithubUserID)
            setLoginGithub(GithubUserJson.login)
            return
        }
        // setToken("")
        await tokenChangedHandler({ email: null })
        setUserLoggedImageSRC("")
    }

    useEffect(() => {
        // https://firebase.google.com/docs/reference/js/firebase.auth.Auth#onidtokenchanged
        const unsubscribe = firebase.auth().onIdTokenChanged(onIdTokenChange)
        return () => unsubscribe()
    }, [])

    async function signOut() {
        await firebase.auth().signOut()
        setUserLoggedImageSRC("")
    }

    return (
        <>
            <Head>
                <title>Alurakut | Comunidades</title>
            </Head>
            <AlurakutMenu
                loginGithub={loginGithub}
                logout={signOut}
                userLoggedImageSRC={userLoggedImageSRC}
            />
            <MainGrid>
                <div className="profileArea" style={{ gridArea: 'profileArea' }}>
                    <ProfileSidebar
                        loginGithub={loginGithub}
                        logout={signOut}
                        userLoggedImageSRC={userLoggedImageSRC}
                    />
                </div>
                <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
                    <Box>
                        <h1 className="title">Comunidades</h1>

                        <OrkutNostalgicIconSet />
                    </Box>

                    <Box>
                        <h2 className="subTitle">O que você deseja fazer?</h2>
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

                    <AllCommunitiesBoxWrapper
                        title="Todas as Comunidades"
                        list={props.allCommunities}
                        count={props.countAllCommunities}
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

    const allCommunities = firstsCommunities.communities.map((community) => {
        return {
            name: community.title,
            key: community.id,
            href: `/communities`,
            imgSRC: community.imageUrl
        }
    })

    const countAllCommunities = firstsCommunities.countCommunities

    return {
        props: {
            allCommunities,
            countAllCommunities
        },
        revalidate: 900,
    }
}



export default Communities