
import Box from '../Box'
import { AlurakutProfileSidebarMenuDefault } from '../../lib/AlurakutCommons';

export default function ProfileSidebar({ loginGithub }) {
    return (
        <Box as="aside">
            <img src={loginGithub?.avatar_url} style={{
                borderRadius: '8px',
                margin: 'auto'
            }} />
            <hr />

            <p>
                <a
                    className="boxLink"
                    href={`https://github.com/${loginGithub?.login}`}
                    target="_blank"
                >
                    {loginGithub?.login}
                </a>
            </p>
            <hr />

            <AlurakutProfileSidebarMenuDefault
                loginGithub={loginGithub}
            />
        </Box>
    )
}