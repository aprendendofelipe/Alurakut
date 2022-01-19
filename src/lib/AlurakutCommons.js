import { useEffect, useState } from 'react'
import Link from '../utils/Link'
import styled, { css } from 'styled-components'
import { useRouter } from 'next/dist/client/router'
import { useLoggedUser } from '../core/hooks'
import { SEARCH_USERS_QUERY } from '../services/Github/gitHubGraphQL'
import { useLazyQuery } from '@apollo/client'
import UsersListWrapper from '../components/SearchUsers'

const BASE_URL = ''
const v = 1
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME

// ================================================================================================================
// Menu
// ================================================================================================================
export function AlurakutMenu({ loginGithub }) {
  const loggedUser = useLoggedUser()
  const [isMenuOpen, setMenuState] = useState(false)
  const [search, setSearch] = useState("")
  const [queryhLazy, setQueryLazy] = useState("")
  const [keyTime, setKeyTime] = useState(0)
  const router = useRouter()
  const [SearchUsers, { loading, error, data: usersFound }] = useLazyQuery(
    SEARCH_USERS_QUERY,
    {
      variables: { userQuery: queryhLazy }
    },
  )

  useEffect(() => {
    const now = Date.now()
    const keyDelay = (now - keyTime)
    const delay = keyDelay > 600 ? 800 : keyDelay + 200
    setKeyTime(now)

    if (search.length > 0) {
      const timeoutId = setTimeout(() => {
        setQueryLazy(search.slice(0))
        SearchUsers()
      }, delay);
      return () => clearTimeout(timeoutId);
    }
  }, [search]);


  useEffect(() => {
    const handleRouteChange = () => setSearch("")
    router.events.on('routeChangeStart', handleRouteChange)
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, []);

  function handleSearch(e) {
    e.preventDefault()
    const dadosDoForm = new FormData(e.target)
    setSearch(dadosDoForm.get('search'))
    if (search) {
      router.push(`/users/${search}`)
    }
    setSearch("")
  }

  return (
    <AlurakutMenu.Wrapper isMenuOpen={isMenuOpen}>
      <div className="container">
        <Link href="/">
          <AlurakutMenu.Logo src={`${BASE_URL}/logo.svg`} />
        </Link>

        <nav style={{ flex: 1 }}>
          {[{ name: 'Inicio', slug: '/' }, { name: 'Amigos', slug: '/' }, { name: 'Comunidades', slug: '/communities' }].map((menuItem) => (
            <Link key={`key__${menuItem.name.toLocaleLowerCase()}`} href={`${menuItem.slug.toLocaleLowerCase()}`}>
              {menuItem.name}
            </Link>
          ))}
        </nav>

        <nav>
          {loggedUser.gitHubUserId
            ? (<>
              <img
                src={loggedUser.photoURL}
                style={{
                  maxHeight: '30px',
                  borderRadius: '8px',
                  margin: 'auto'
                }}
              />
              <a
                onClick={loggedUser.signOut}
              >
                Sair
              </a>
            </>)
            : <Link
              href="/login"
            >Entrar</Link>
          }
        </nav>
        <div>
          <form onSubmit={(e) => handleSearch(e)} >
            <input
              type="text"
              autoFocus={true}
              placeholder={"Pesquisar em " + APP_NAME}
              name="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete='off'
            />
            < UsersListWrapper
              usersFound={usersFound}
              search={search}
            />
          </form>
        </div>

        <button onClick={() => setMenuState(!isMenuOpen)}>
          {isMenuOpen && <img src={`${BASE_URL}/icons/menu-open.svg?v=${v}`} />}
          {!isMenuOpen && <img src={`${BASE_URL}/icons/menu-closed.svg?v=${v}`} />}
        </button>
      </div>
      <AlurakutMenuProfileSidebar githubUser={loginGithub} />
    </AlurakutMenu.Wrapper>
  )
}

AlurakutMenu.Wrapper = styled.header`

  .alurakutMenuProfileSidebar {
    background: white;
    position: fixed;
    z-index: 100;
    padding: 46px;
    bottom: 0;
    left: 0;
    right: 0;
    top: 48px;
    transition: .3s;
    pointer-events: ${({ isMenuOpen }) => isMenuOpen ? 'all' : 'none'};
    opacity: ${({ isMenuOpen }) => isMenuOpen ? '1' : '0'};
    transform: ${({ isMenuOpen }) => isMenuOpen ? 'translateY(0)' : 'translateY(calc(-100% - 48px))'};
    @media(min-width: 860px) {
      display: none;
    }
    > div {
      max-width: 400px;
      margin: auto;
    }
    a {
      font-size: 18px;
    }

    .boxLink {
      font-size: 18px;
      color: var(--colorPrimary);
      -webkit-text-decoration: none;
      text-decoration: none;
      font-weight: 800;
    }

    hr {
      margin-top: 12px;
      margin-bottom: 8px;
      border-color: transparent;
      border-bottom-color: #ECF2FA;
    }
  }

  .container {
    background-color: var(--colorSecondary);
    padding: 7px 16px;
    gap: 5px;
    width: 100vw;
    height: 48px;
    max-width: 1078px;
    margin: auto;
    display: flex;
    justify-content: space-between;
    position: fixed;
    left: 50%;
    transform: translate(-50%, 0);
    z-index: 101;
    @media(min-width: 860px) {
      justify-content: flex-start;
    }

    button {
      border: 0;
      background: transparent;
      align-self: center;
      display: inline-block;
      @media(min-width: 860px) {
        display: none;
      }
    }

    nav {
      display: none;
      @media(min-width: 860px) {
        display: flex;
      }
      a {
        font-size: 12px;
        color: white;
        padding: 10px 16px;
        position: relative;
        text-decoration: none;
      }
      img {
        padding: auto;
        position: relative;
      }
    }
    input {
      position: relative;
      z-indeX: 2;
      width: 100%;
      color: var(--colorPrimary);
      background: var(--backgroundTertiary);
      padding-top: 10px;
      padding-bottom: 10px;
      padding-left: 10px;
      padding-right: 5px;
      border: 0;
      background-image: url(${`${BASE_URL}/icons/search.svg`});
      background-position: right 10px center;
      background-repeat: no-repeat;
      border-radius: 1000px;
      font-size: 12px;
      ::placeholder {
        color: var(--colorPrimary);
        opacity: 0.6;
      }
      :focus {
        ::placeholder {
        color: var(--colorPrimary);
        opacity: 0.2;
      }
      }
    } 
  }
`;
AlurakutMenu.Logo = styled.img`
  background-color: var(--backgroundTertiary);
  padding: 9px 14px;
  border-radius: 1000px;
  height: 34px;
  @media(max-width: 359px) {
      padding: 1px;
  }
`;

function AlurakutMenuProfileSidebar({ githubUser }) {
  return (
    <div className="alurakutMenuProfileSidebar">
      <div>
        <img src={githubUser?.avatar_url} style={{
          borderRadius: '8px',
          margin: 'auto'
        }} />
        <hr />
        <p>
          <a className="boxLink" href={`https://github.com/${githubUser?.login}`} target="_blank" >
            {githubUser?.login}
          </a>
        </p>
        <hr />

        <AlurakutProfileSidebarMenuDefault
          loginGithub={githubUser}
        />
      </div>
    </div>
  )
}

// ================================================================================================================
// AlurakutProfileSidebarMenuDefault
// ================================================================================================================
export function AlurakutProfileSidebarMenuDefault({ loginGithub }) {
  const loggedUser = useLoggedUser()
  return (
    <AlurakutProfileSidebarMenuDefault.Wrapper>
      <nav>
        <a href={`https://github.com/${loginGithub?.login}`} target="_blank">
          <img src={`${BASE_URL}/icons/user.svg`} />
          Perfil
        </a>
        <Link href="/users/aprendendofelipe">
          <img src={`${BASE_URL}/icons/book.svg`} />
          Recados
        </Link>
        <Link href="/communities">
          <img src={`${BASE_URL}/icons/camera.svg`} />
          Comunidades
        </Link>
        <Link href="/users/aprendendofelipe">
          <img src={`${BASE_URL}/icons/sun.svg`} />
          Depoimentos
        </Link>
      </nav>
      <hr />
      <nav>
        <a href="https://github.com/trending" target="_blank">
          <img src={`${BASE_URL}/icons/plus.svg`} />
          GitHub Trends
        </a>
        {loggedUser.gitHubUserId
          ? (<>
            <a onClick={loggedUser?.signOut}             >
              <img src={`${BASE_URL}/icons/logout.svg`} />
              Sair
            </a>
          </>)
          : <Link href="/login" >Entrar</Link>
        }
      </nav>
    </AlurakutProfileSidebarMenuDefault.Wrapper>
  )
}
AlurakutProfileSidebarMenuDefault.Wrapper = styled.div`
  a {
    font-size: 12px;
    color: var(--colorPrimary);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    text-decoration: none;
    img {
      width: 16px;
      height: 16px;
      margin-right: 5px; 
    }
  }
`;

// ================================================================================================================
// OrkutNostalgicIconSet
// ================================================================================================================
export function OrkutNostalgicIconSet(props) {
  return (
    <OrkutNostalgicIconSet.List>
      {[
        { name: 'Recados', slug: 'recados', icon: 'book' },
        { name: 'Fotos', slug: 'fotos', icon: 'camera' },
        { name: 'Videos', slug: 'videos', icon: 'video-camera' },
        { name: 'Fãs', slug: 'fas', icon: 'star' },
        { name: 'Mensagens', slug: 'mensagens', icon: 'email' },
      ].map(({ name, slug, icon }) => (
        <li key={`orkut__icon_set__${slug}`}>
          <span style={{ gridArea: 'title' }} className="OrkutNostalgicIconSet__title">
            {name}
          </span>
          <span className="OrkutNostalgicIconSet__number" style={{ gridArea: 'number' }}>
            <img key={`orkut__icon_set__${slug}_img`} className="OrkutNostalgicIconSet__iconSample" src={`/icons/${icon}.svg`} />
            {props[slug] ? props[slug] : 0}
          </span>
        </li>
      ))}
      {[
        { name: 'Confiável', slug: 'confiavel', icon: 'smile' },
        { name: 'Legal', slug: 'legal', icon: 'cool' },
        { name: 'Sexy', slug: 'sexy', icon: 'heart' },
      ].map(({ name, slug, icon }) => {
        const total = props[slug] ? props[slug] : 2;
        return (
          <li key={`orkut__icon_set__${slug}`}>
            <span className="OrkutNostalgicIconSet__title">
              {name}
            </span>
            <span className="OrkutNostalgicIconSet__iconComplex" className="OrkutNostalgicIconSet__number" style={{ gridArea: 'number' }}>
              {[0, 1, 2].map((_, index) => {
                const isHeartActive = index <= (total - 1);
                return <img key={`orkut__icon_set__${slug}_img_${index}`} src={`/icons/${icon}.svg`} style={{ marginRight: '2px', opacity: isHeartActive ? 1 : '0.5' }} />
              })}
            </span>
          </li>
        );
      })}
    </OrkutNostalgicIconSet.List>
  )
}

OrkutNostalgicIconSet.List = styled.ul`
  margin-top: 32px;
  list-style: none;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  li {
    font-size: 12px;
    color: var(--textTertiaryColor);
    display: grid;
    grid-template-areas:
      "title title"
      "number number"; 
    
    &:not(:last-child) {
      margin-right: 5px;
    }
    .OrkutNostalgicIconSet__title {
      display: block;
      font-style: italic; 
    }
    .OrkutNostalgicIconSet__number {
      min-width: 15px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .OrkutNostalgicIconSet__iconSample {
        margin-right: 7px;
      }
    }
  }
`;

// ================================================================================================================
// Reset Styles
// ================================================================================================================
export const AlurakutStyles = css`
  *::-webkit-scrollbar {
    width: 8px;
  }
  *::-webkit-scrollbar-track {
    background: #f1f1f1; 
  }
  *::-webkit-scrollbar-thumb {
    background: #888; 
    border-radius: 10px;
  }
  *::-webkit-scrollbar-thumb:hover {
    background: #555; 
  }
  a,
  button {
    cursor: pointer;
    transition: .3s;
    outline: 0;
    &:hover,
    &:focus {
      opacity: .8;
    }
    &:disabled {
      cursor: not-allowed;
      opacity: .5;
    }
  }
  input {
    transition: .3s;
    outline: 0;
    &:disabled {
      cursor: not-allowed;
      opacity: .5;
    }
    &:hover,
    &:focus {
      box-shadow: 0px 0px 5px #33333357;
    }
  }
`;