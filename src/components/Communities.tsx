import styled from 'styled-components'
import { useLoggedUser } from '../core/hooks'
import Link from '../utils/Link'
import InputBox from './InputBox'
import Box from './Box'
import { PostsApiClient } from '../core/apis_clients'
import { useWarnIfUnsavedChanges } from '../utils/UnsavedChanges'
import { useState } from 'react'

export function AllCommunitiesBox({ title, count, list }) {
  return (
    <AllCommunitiesBoxWrapper>
      <h2 className="subTitle">
        {`${title} (${count})`}
      </h2>

      <ul>
        {list && list.map((item) => {
          return (
            <li key={item.key}>
              <Link href={item.href}>
                <img src={item.imgSRC} />
                <span>{item.name}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </AllCommunitiesBoxWrapper>
  )
}

export function NewCommunityBox() {
  const loggedUser = useLoggedUser()
  const [unsavedChanges, setUnsavedChanges] = useState([])
  const [title, setTitle] = useState("")
  const [imageURL, setImageURL] = useState("")
  const [isButtonVisible, setButtonVisible] = useState(true)

  useWarnIfUnsavedChanges(unsavedChanges)

  function addUnsavedChanges(id) {
    setUnsavedChanges([...unsavedChanges, id])
  }

  function removeUnsavedChanges(id) {
    setUnsavedChanges(unsavedChanges.filter(item => item != id))
  }


  async function handleAddCommunity(e) {
    e.preventDefault();
    const dadosDoForm = new FormData(e.target);

    const community = {
      itemType: 'community',
      title: dadosDoForm.get('title'),
      imageUrl: dadosDoForm.get('image')
    }
    addUnsavedChanges(community.title)
    setButtonVisible(false)

    const createdCommunity = await PostsApiClient('POST', community, loggedUser)

    if (!createdCommunity.id) {
      console.error(createdCommunity)
    } else {
      setTitle("")
      setImageURL("")
    }

    removeUnsavedChanges(community.title)
    setButtonVisible(true)
  }
  return (<>
    {!!loggedUser?.gitHubUserId &&
      <InputBox>
        <h2 className="subTitle">Crie novas comunidades.</h2>
        <form onSubmit={(e) => handleAddCommunity(e)}>
          <div>
            <input
              placeholder="Defina o nome da sua comunidade!"
              name="title"
              aria-label="Defina o nome da sua comunidade!"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <input
              placeholder="Informe a URL da imagem que usaremos de capa"
              name="image"
              aria-label="Informe a URL da imagem que usaremos de capa"
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
            />
          </div>
          <button>
            {isButtonVisible ?
              "Criar comunidade" :
              "Criando..."
            }
          </button>
        </form>
      </InputBox>
    }
  </>)
}


const AllCommunitiesBoxWrapper = styled(Box)`
    ul {
      display: grid;
      grid-gap: 8px;
      grid-template-columns: 1fr 1fr 1fr 1fr; 
      /* max-height: 220px; */
      list-style: none;
    }
    img {
      object-fit: cover;
      background-position: center center;
      width: 100%;
      height: 100%;
      position: relative;
    }
    ul li a {
      display: inline-block;
      height: 102px;
      position: relative;
      overflow: hidden;
      border-radius: 8px;
      span {
        color: #FFFFFF;
        font-size: 10px;
        position: absolute;
        left: 0;
        bottom: 10px;
        z-index: 2;
        padding: 0 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
      &:after {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        z-indeX: 1;
        background-image: linear-gradient(0deg,#00000073,transparent);
      }
    }
  `;
