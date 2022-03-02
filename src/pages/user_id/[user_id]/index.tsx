import UserProfile from '../../../components/UserProfile'
import { getServerProps } from '../../../services/Vercel/serverside'

const ProfileById = (props) => <UserProfile UserProfileProps={props} />

export async function getStaticProps({ params }) {
  return {
    ...await getServerProps({ uid: params.user_id, login: '' }),
    revalidate: 5
  }
}

export async function getStaticPaths() {
  const paths = []

  return {
    paths,
    fallback: 'blocking'
  }
}

export default ProfileById