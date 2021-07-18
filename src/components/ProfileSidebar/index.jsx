
import Box from '../Box'
import { AlurakutProfileSidebarMenuDefault } from '../../lib/AlurakutCommons';

export default function ProfileSidebar(props) {

    return (
        <Box as="aside">
            <img src={`https://github.com/${props.loginGithub}.png`} style={{
                borderRadius: '8px',
                margin: 'auto'
            }} />
            <hr />

            <p>
                <a
                    className="boxLink"
                    href={`https://github.com/${props.loginGithub}`}
                    target="_blank"
                >
                    {props.loginGithub}
                </a>
            </p>
            <hr />

            <AlurakutProfileSidebarMenuDefault logout={props.logout} userLoggedImageSRC={props.userLoggedImageSRC} />
        </Box>
    )
}