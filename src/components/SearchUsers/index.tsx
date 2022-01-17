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
            < UserListBox show={search && usersList.length} >
                <div>
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
                </div>
            </UserListBox>
        }
    </>)
}


const UserListBox = styled.div`

    overflow: hidden;
    margin-top: -19px;
    margin-left: -5px;
    margin-right: -5px;

    div {
        background: var(--colorSecondary);
        border-bottom-left-radius: 17px;
        border-bottom-right-radius: 17px;
        position: relative;
        padding: 5px;
        padding-top: 0px;
        transition: .3s;
        pointer-events: ${({ show }) => show ? 'all' : 'none'};
        opacity: ${({ show }) => show ? '1' : '0'};
        transform: ${({ show }) => show ? 'translateY(0)' : 'translateY(calc(-100% - 48px))'};
        @media(max-width: 359px) {
            width: 65vw;
        }
    }
    
    ul {
        background: var(--textQuarternaryColor);
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
        padding-top: 20px;
        list-style: none;
    }
    ul li {
        padding: 4px;
        overflow: hidden;
    }
    ul li a {        
        display: inline-block;
        width: 100%;
        /* height: 48px; */
        position: relative;
        overflow: hidden;
        border-radius: var(--commonRadius); 
        &:after {
            content: "";
            position: absolute;
            /* border-radius: 100px; */
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
            z-indeX: 1;
            background-image: linear-gradient(0deg,#D9E6F673,transparent);
        }
        :focus {
            background: var(--backgroundPrimary);
        }
        :hover {
            background: var(--backgroundQuarternary);
        }
    }
    ul li a img {
      width: 48px;
      height: 48px;
      position: relative;
      border-radius: var(--commonRadius);
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