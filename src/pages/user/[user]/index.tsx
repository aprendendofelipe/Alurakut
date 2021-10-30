import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/dist/client/router';
import MainGrid from '../../../components/MainGrid'
import Box from '../../../components/Box'
import { AlurakutMenu, OrkutNostalgicIconSet } from '../../../lib/AlurakutCommons'
import ProfileRelationsBoxWrapper from '../../../components/ProfileRelations'
import ProfileSidebar from '../../../components/ProfileSidebar'
import { UserGithubAPI } from '../../../services/Github/github'
import { getTestemonials } from '../../../services/Dato/Dato'
import { getUserCommunities } from '../../../services/Dato/Dato'
import firebase from '../../../services/Firebase/firebase'
import tokenChangedHandler from '../../../services/Firebase/tokenChangedHandler'
import TestimonialsBoxWrapper from '../../../components/Testimonials'
import { pessoasFavoritas, pessoasFavoritasOBJList } from '../../../utils/topUsers'

const Profile = (props) => {
  const userProfile = props.githubUser.login;
  const [comunidades, setComunidades] = useState([]);
  const [countComunidades, setCountComunidades] = useState(0);
  const [token, setToken] = useState("");
  const [testimonials, setTestimonials] = useState([]);
  const [countTestimonials, setCountTestimonials] = useState(0);
  const [newTestimonials, setNewTestimonials] = useState("");
  const [userLoggedImageSRC, setUserLoggedImageSRC] = useState("");

  const router = useRouter()

  // const [seguidores, setSeguidores] = useState([]);
  // 0 - Pegar o array de dados do github 
  useEffect(() => {
    const getAllCommunities = async () => {
      // GET
      // fetch(props.githubUser.followers_url)
      //   .then(function (respostaDoServidor) {
      //     return respostaDoServidor.json();
      //   })
      //   .then(function (respostaCompleta) {
      //     setSeguidores(respostaCompleta);
      //   })

      const { communities, countCommunities } = await getUserCommunities(userProfile);

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

    getAllCommunities()
    setCountTestimonials(props.testimonials.countTestimonials)

  }, [router, userProfile])

  async function onIdTokenChange(firebaseUser) {
    if (firebaseUser) {
      const photoURL = firebaseUser.photoURL;
      setUserLoggedImageSRC(photoURL)
      setToken(await firebase.auth().currentUser.getIdToken())
      return
    }
    setToken("")
    await tokenChangedHandler({ email: null })
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

  async function handleAddTestimonial(e) {
    e.preventDefault();
    const dadosDoForm = new FormData(e.target);
    const text = dadosDoForm.get('testimonialText')
    if (text == "" || text == null) {
      return
    }

    setNewTestimonials("")

    const testimonial = {
      text: text,
      receiver: userProfile,
    }

    fetch('/api/testimonials', {
      method: 'POST',
      headers: {
        Authorization: token || 'unauthenticated',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testimonial)
    })
      .then(async (response) => {
        const { registroCriado } = await response.json();
        const testimonial = {
          name: registroCriado.author,
          key: registroCriado.id,
          href: `/users/${registroCriado.author}`,
          imgSRC: `https://github.com/${registroCriado.author}.png`,
          text: registroCriado.text
        }
        const newsTestimonials = [testimonial, ...testimonials];
        setTestimonials(newsTestimonials)
        setCountTestimonials(countTestimonials + 1)
      })
  }

  return (
    <>
      <Head>
        <title>{`Alurakut | ${userProfile}`}</title>
      </Head>
      <AlurakutMenu
        loginGithub={userProfile}
        logout={signOut}
        userLoggedImageSRC={userLoggedImageSRC}
      />
      <MainGrid>
        {/* <Box style="grid-area: profileArea;"> */}
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar
            loginGithub={userProfile}
            logout={signOut}
            userLoggedImageSRC={userLoggedImageSRC}
          />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              {userProfile}
            </h1>
            <p>
              {props.githubUser.bio}
            </p>

            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">{`Escrever um depoimento para ${userProfile}:`}</h2>
            <form onSubmit={(e) => handleAddTestimonial(e)}>
              <div>
                <textarea
                  disabled={!userLoggedImageSRC}
                  rows={4}
                  className="inputTestimonialArea"
                  placeholder={`Escreva aqui o seu depoimento para ${userProfile}...`}
                  name="testimonialText"
                  aria-label={`Escreva aqui o seu depoimento para ${userProfile}...`}
                  value={newTestimonials}
                  onChange={(e) => setNewTestimonials(e.target.value)}
                />
              </div>

              {userLoggedImageSRC
                ? <button>Postar</button>
                : null
              }

            </form>

            {userLoggedImageSRC
              ? null
              : (<button onClick={() => { router.push("/login") }}
              >
                Entrar para Postar
              </button>)}

          </Box>

          <TestimonialsBoxWrapper
            loginGithub={userProfile}
            count={countTestimonials}
            list={testimonials}
            token={token}
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

  const githubUser = await UserGithubAPI(params.user)
  const testimonials = await getTestemonials(githubUser.login)

  return {
    props: {
      githubUser,
      testimonials
    },
    revalidate: 5,
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