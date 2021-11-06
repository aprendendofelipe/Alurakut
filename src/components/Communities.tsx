import styled from 'styled-components';
import { useLoggedUser } from '../core/hooks';
import Link from '../utils/Link';
import Box from './Box';
import { AddCommunity, DelCommunity, AddReport, CancelReport } from '../core/apis_clients'

export function AllCommunitiesBox({ title, count, list }) {
  return (
    <AllCommunitiesBoxWrapper>
      <h2 className="smallTitle">
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
  // const loggedUser = useLoggedUser()

  // function handleAddCommunity(e) {
  //   e.preventDefault();
  //   const dadosDoForm = new FormData(e.target);

  //   const comunidade = {
  //     title: dadosDoForm.get('title'),
  //     imageUrl: dadosDoForm.get('image')
  //   }

  //   const comunidadeCriada = dados.registroCriado;
  //   const comunidadesAtualizadas = [...comunidades, comunidadeCriada];
  //   setComunidades(comunidadesAtualizadas)

  // }
  return (
    <Box>
      {/* <h2 className="subTitle">Crie novas comunidades.</h2>
      <form onSubmit={(e) => handleCriaComunidade(e, comunidades, token, setComunidades)}>
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
      </form> */}
    </Box>
  )
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