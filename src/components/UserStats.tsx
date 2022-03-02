export default function UserStats({ username }) {
    return (
        <div style={{
            margin: '-16px',
        }}>
            <a href="https://github.com/anuraghazra/github-readme-stats"
                target="_blank" rel="noreferrer noopener nofollow"
            >
                <img
                    src={
                        'https://github-readme-stats.vercel.app/api?username=' +
                        username +
                        '&locale=pt-br' +
                        '&include_all_commits=true' +
                        '&hide_border=true' +
                        '&hide_title=true' +
                        '&show_icons=true' +
                        '&icon_color=D81D99' +
                        '&text_color=2E7BB4'
                    } />
            </a>
        </div>
    )
}

export function TopLangs({ username }) {
    return (<>
        <h2 className="subTitle">
            Linguagens mais usadas
        </h2>
        <div style={{
            margin: '-16px',
            marginTop: '-22px',
            position: 'relative'
        }}>
            <a
                href="https://github.com/anuraghazra/github-readme-stats"
                target="_blank" rel="noreferrer noopener nofollow"
            >
                <img
                    src={
                        'https://github-readme-stats.vercel.app/api/top-langs/?username=' +
                        username +
                        '&locale=pt-br' +
                        '&hide_border=true' +
                        '&hide_title=true' +
                        '&layout=compact'
                    }
                />
            </a>
        </div>
    </>)
}