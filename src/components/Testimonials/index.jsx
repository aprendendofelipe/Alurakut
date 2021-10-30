import styled from 'styled-components'
import Link from '../../utils/Link'
import Box from '../Box'
import { handleDelTestimonial } from '../../services/Dato/Testimonials'

const BoxWrapper = styled(Box)`
    ul {
      display: grid;
      grid-gap: 8px;
      grid-template-columns: 1fr; 
      list-style: none;
    }
    img {
      object-fit: cover;
      background-position: center center;
      width: 100%;
      height: 100%;
      position: relative;
    }
    ul li div {
      display: grid;
      grid-gap: 8px;
      grid-template-columns: 88px 1fr 60px;
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
    
    ul li p {
      font: 400 14px Arial;
      height: 100%;
      padding: 8px;
      position: relative;
      overflow: hidden;
      border-radius: 8px;    
      &:after {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        z-indeX: 1;
        background-image: linear-gradient(0deg,#BBCDE873,transparent);
      }
    }
    ul li button {
      height: fit-content;
    }
`;

export default function TestimonialsBoxWrapper({ loginGithub, count, list, token }) {
  return (
    <BoxWrapper>
      <h2 className="smallTitle">
        {`Depoimentos de ${loginGithub} (${count}):`}
      </h2>

      <ul>
        {list.map((item) => {
          return (
            <li key={item.key}>
              <div>
                <Link href={item.href}>
                  <img src={item.imgSRC} />
                  <span>{item.name}</span>
                </Link>
                <p>{item.text}</p>
                <button onClick={(e) => handleDelTestimonial(e, item.key, token)}>
                  excluir
                </button>
              </div>
            </li>)
        })}
      </ul >
    </BoxWrapper >
  )
}
