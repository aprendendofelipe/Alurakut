import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Link from '../../utils/Link'


export default function UsersListWrapper({ usersFound, search }) {
    const [usersList, setUsersList] = useState([])

    useEffect(() => {

        const edges = usersFound?.search?.edges || []

        setUsersList(
            edges.map((item) => {
                return {
                    id: item.node.id,
                    imgSRC: item.node.avatarUrl,
                    name: item.node.login,
                    href: `/users/${item.node.login}`,
                }
            })
        )
    }, [usersFound])


    return (<>
        {usersList == [] ? null :
            < UserListBox search={search && usersList.length} >
                <ul>
                    {usersList.map((item) => {
                        return (<li key={item.id}>
                            <Link href={item.href}>
                                <img src={item.imgSRC} />
                                <span>{item.name}</span>
                            </Link>
                        </li>)
                    })}
                </ul>
            </UserListBox>
        }
    </>)
}


const UserListBox = styled.div`
    background: var(--colorSecondary);
    border-radius: 12px;
    margin: -10px;
    top: -40px;
    position: relative;
    padding: 6px;
    padding-top: 54px;
    z-indeX: 1;
    transition: .2s;
    pointer-events: ${({ search }) => search ? 'all' : 'none'};
    opacity: ${({ search }) => search ? '1' : '0'};
    transform: ${({ search }) => search ? 'translateY(0)' : 'translateY(calc(-100% - 48px))'};
    @media(max-width: 360px) {
        width: 70vw;
    }
    
    ul {
        background: var(--textQuarternaryColor);
        border-radius: var(--commonRadius);
        list-style: none;
    }
    ul li {
        padding: 4px;
        overflow: hidden;
    }
    ul li a {
      display: inline-block;
      height: 48px;
      position: relative;
      border-radius: 8px;
      &:after {
        content: "";
        position: absolute;
        border-radius: 100px;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        z-indeX: 1;
        background-image: linear-gradient(0deg,#00000050,transparent);
        }
      }
    ul li a img {
      width: 100%;
      height: 100%;
      position: relative;
      border-radius: 100px;
    }
    ul li a span {
        color: var(--textPrimaryColor);
        font-size: 12px;
        position: absolute;
        left: 50px;
        bottom: 16px;
        z-index: 2;
        padding: 0 4px;
        text-overflow: ellipsis;
        width: 100%;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
`