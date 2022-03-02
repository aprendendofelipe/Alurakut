export default function UserStats({ username }) {
    return (
        <div style={{
            margin: '-16px',
            position: 'relative'
        }}>
            <iframe
                height={'100%'}
                width={'100%'}
                frameBorder={0}
                allowFullScreen={false}
                src={'https://github-readme-stats.vercel.app/api?username=' +
                    username +
                    '&count_private=true' +
                    '&locale=pt-br' +
                    '&hide_border=true' +
                    '&hide_title=true' +
                    '&show_icons=true' +
                    '&icon_color=D81D99' +
                    '&text_color=2E7BB4'
                }
            />
            <a
                style={{
                    display: 'inline-block',
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: '0',
                    left: '0',
                }}
                href='https://github.com/anuraghazra/github-readme-stats'
                target="_blank" rel="noreferrer noopener nofollow"
            />
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
            <iframe
                height={'100%'}
                width={'100%'}
                frameBorder={0}
                allowFullScreen={false}
                src={'https://github-readme-stats.vercel.app/api/top-langs/?username=' +
                    username +
                    '&count_private=true' +
                    '&locale=pt-br' +
                    '&hide_border=true' +
                    '&hide_title=true' +
                    '&layout=compact'
                }
            />
            <a
                style={{
                    display: 'inline-block',
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: '0',
                    left: '0',
                }}
                href='https://github.com/anuraghazra/github-readme-stats'
                target="_blank" rel="noreferrer noopener nofollow"
            />
        </div>
    </>)
}