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
            <UserListBox show={search && usersList.length} >
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
    margin-top: -39px;
    margin-left: -5px;
    margin-right: -5px;

    div {
        background: var(--colorSecondary);
        border-radius: 22px;
        position: relative;
        padding: 5px;
        transition: .3s;
        box-shadow: 0px 2px 8px #333333AA;
        pointer-events: ${({ show }) => show ? 'all' : 'none'};
        opacity: ${({ show }) => show ? '1' : '0'};
        transform: ${({ show }) => show ? 'translateY(0) scaleY(1)' : 'translateY(calc(-50% + 17px)) scaleY(0)'};
        @media(max-width: 359px) {
            width: 65vw;
        }
    }
    
    ul {
        background: var(--textQuarternaryColor);
        border-radius: 18px;
        padding-top: 39px;
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