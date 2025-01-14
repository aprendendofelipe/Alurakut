import { useEffect, useState } from 'react';
import { useRouter } from 'next/dist/client/router'
import styled from 'styled-components'
import Link from '../utils/Link'
import Box from './Box'
import { PostsApiClient } from '../core/apis_clients'
import { useGitHubUserAPI, useLoggedUser } from '../core/hooks'
import { useWarnIfUnsavedChanges } from '../utils/UnsavedChanges';

const TestimonialsBoxWrapper = ({ userProfile, list }) => {
  const [testimonials, setTestimonials] = useState([])
  const [countTestimonials, setCountTestimonials] = useState(list.countTestimonials)
  const [newTextTestimonials, setNewTextTestimonials] = useState('')
  const [unsavedChanges, setUnsavedChanges] = useState([])
  const loggedUser = useLoggedUser()
  const loggedGitHubUser = useGitHubUserAPI(loggedUser?.gitHubUserId)
  const router = useRouter()

  useWarnIfUnsavedChanges(unsavedChanges)

  useEffect(() => {
    setTestimonials(
      list.testimonials.map((item) => {
        return {
          name: item.author,
          key: item.id,
          href: `/users/${item.author}`,
          imgSRC: `https://github.com/${item.author}.png`,
          text: item.text,
          author_id: item.authorId,
          receiver_id: item.receiverId
        }
      }))
    setCountTestimonials(list.countTestimonials)
  }, [list])

  useEffect(() => {
    setNewTextTestimonials('')
  }, [router])

  function addUnsavedChanges(id) {
    setUnsavedChanges([...unsavedChanges, id])
  }

  function removeUnsavedChanges(id) {
    setUnsavedChanges(unsavedChanges.filter(item => item != id))
  }


  function updateTestimonials(testimonial) {
    setTestimonials([
      ...testimonials.filter(item => item.key > testimonial.key),
      testimonial,
      ...testimonials.filter(item => item.key < testimonial.key)
    ])
  }

  async function handleAddTestimonial(e) {
    e.preventDefault();
    const dadosDoForm = new FormData(e.target);
    const text = dadosDoForm.get('testimonialText')
    if (text == "" || text == null) {
      return
    }

    addUnsavedChanges(text.slice(0))

    setNewTextTestimonials("")

    const testimonial = {
      itemType: 'testimonial',
      text: text,
      receiver: userProfile.login,
    }

    if (loggedGitHubUser?.login) {

      const newTestimonial = {
        name: loggedGitHubUser.login,
        key: loggedGitHubUser.login + Date.now(),
        href: `/users/${loggedGitHubUser.login}`,
        imgSRC: loggedGitHubUser.avatar_url,
        text: testimonial.text,
        author_id: loggedUser.gitHubUserId,
        receiver_id: ''
      }

      setTestimonials([newTestimonial, ...testimonials])
      setCountTestimonials(countTestimonials + 1)
      const createdTestimonial = await PostsApiClient('POST', testimonial, loggedUser)
      if (!createdTestimonial.id) {
        setTestimonials(testimonials.filter(item => item.key != newTestimonial.key))
        console.error(createdTestimonial)
      } else {
        const savedTestimonial = {
          name: createdTestimonial.author,
          key: createdTestimonial.id,
          href: `/users/${createdTestimonial.author}`,
          imgSRC: `https://github.com/${createdTestimonial.author}.png`,
          text: createdTestimonial.text,
          author_id: createdTestimonial.authorId,
          receiver_id: createdTestimonial.receiverId
        }
        setTestimonials([
          savedTestimonial,
          ...testimonials.filter(item => item.key != newTestimonial.key)
        ])
      }
    }

    removeUnsavedChanges(text)
  }

  async function handleDelTestimonial(e, itemId) {
    e.preventDefault()
    addUnsavedChanges(itemId)
    let toDelete = testimonials.filter(item => item.key == itemId)[0]

    if (confirm('Confirma a exclusão do depoimento abaixo? \n \n' + toDelete.text)) {
      await confirmedDelTestimonial(itemId, toDelete)
    }
    removeUnsavedChanges(itemId)
  }

  async function confirmedDelTestimonial(itemId, toDelete) {
    setTestimonials(testimonials.filter(item => item.key != itemId))
    setCountTestimonials(countTestimonials - 1)
    const body = { id: itemId }
    const deleted = await PostsApiClient('DELETE', body, loggedUser)
    if (deleted?.id != toDelete?.key) {
      updateTestimonials(toDelete)
      setCountTestimonials(countTestimonials + 1)
      console.error(deleted)
    }
  }

  async function handleReport(e, itemId) {
    e.preventDefault();
    addUnsavedChanges(itemId)
    let toReport = testimonials.filter(item => item.key == itemId)[0]
    toReport.report = 'pending'
    updateTestimonials(toReport)
    const report = { itemType: 'report', reportedId: itemId, text: '' }
    const reported = await PostsApiClient('POST', report, loggedUser)
    if (reported?.postid == itemId) {
      toReport.report = Number(reported.id)
    } else {
      toReport.report = 'report error'
      console.error(reported)
    }
    updateTestimonials(toReport)
    removeUnsavedChanges(itemId)
  }

  async function handleCancelReport(e, itemId) {
    e.preventDefault();
    addUnsavedChanges(itemId)
    let toCancelReport = testimonials.filter(item => item.key == itemId)[0]
    toCancelReport.receiver_id = ''
    const reportId = toCancelReport.report
    toCancelReport.report = 'canceling'
    updateTestimonials(toCancelReport)
    const body = { id: reportId.toString() }
    const reportCanceled = await PostsApiClient('DELETE', body, loggedUser)
    if (reportCanceled?.id == reportId) {
      toCancelReport.report = 'canceled'
    } else {
      toCancelReport.report = reportId
      console.error(reportCanceled)
    }
    updateTestimonials(toCancelReport)
    removeUnsavedChanges(itemId)
  }

  const TestimonialsList = ({ testimonials }) => {
    return (<>
      {testimonials.map((item) => {
        return (
          <li key={item.key}>
            <div>
              <Link href={item.href}>
                <img src={item.imgSRC} />
                <span>{item.name}</span>
              </Link>
              <div>
                <p>{item.text}</p>
                {(item.receiver_id && loggedUser?.gitHubUserId && !item.report) && (
                  (item.receiver_id == loggedUser.gitHubUserId || item.author_id == loggedUser.gitHubUserId)
                    ? <button onClick={(e) => handleDelTestimonial(e, item.key)}>
                      excluir
                    </button>
                    : < button onClick={(e) => handleReport(e, item.key)}>
                      denunciar
                    </button>
                )}
                {(typeof item.report === 'number') && (
                  < button onClick={(e) => handleCancelReport(e, item.key)}>
                    cancelar denúncia
                  </button>
                )}
              </div>
            </div>
          </li>)
      })}
    </>)
  }

  return (<>
    {userProfile.id != loggedUser?.gitHubUserId &&
      <Box>
        <h2 className="subTitle">{`Escreva um depoimento para ${userProfile.login}:`}</h2>
        <form onSubmit={(e) => handleAddTestimonial(e)}>
          <div>
            <textarea
              disabled={!loggedUser?.gitHubUserId}
              rows={4}
              className="inputTestimonialArea"
              placeholder={`Escreva aqui o seu depoimento para ${userProfile.login}...`}
              name="testimonialText"
              aria-label={`Escreva aqui o seu depoimento para ${userProfile.login}...`}
              value={newTextTestimonials}
              onChange={(e) => setNewTextTestimonials(e.target.value)}
            />
          </div>

          {loggedUser?.gitHubUserId
            ? <button>Postar</button>
            : null
          }

        </form>

        {loggedUser?.gitHubUserId
          ? null
          : (<button onClick={() => { router.push("/login") }}
          >
            Entrar para Postar
          </button>)}

      </Box>}
    {countTestimonials > 0 &&
      <BoxWrapper>
        <h2 className="subTitle">
          {`Depoimento(s) de ${userProfile.login} (${countTestimonials}):`}
        </h2>

        <ul>
          <TestimonialsList
            testimonials={testimonials}
          />
        </ul >
      </BoxWrapper >}
  </>
  )
}



export default TestimonialsBoxWrapper



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
      grid-template-columns: 88px 1fr;
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
    
    ul li div div {
      display: grid;
      grid-gap: 0px;
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 20px;
      border-radius: 8px;
      z-indeX: 1;
      background-image: linear-gradient(0deg,#BBCDE873,transparent);
      p {
        color: #020068;
        font: 400 14px Arial;
        height: 100%;
        padding: 8px;
        position: relative;
        overflow: hidden;
        white-space: pre-line;
        &:after {
          content: "";
          display: block;
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
        }
      }
      button {
        height: fit-content;
        width: fit-content;
        padding: 0px 5px;
        justify-self: end;
        position: relative;
        top: 0;
        right: 5px;
      }
    }
`;