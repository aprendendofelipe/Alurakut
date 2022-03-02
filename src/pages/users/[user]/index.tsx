import { getServerProps } from '../../../services/Vercel/serverside'
import UserProfile from '../../../components/userProfile'

const ProfileByUsername = (props) => <UserProfile UserProfileProps={props} />

export async function getStaticProps({ params }) {
  return {
    ...await getServerProps({ uid: '', login: params.user }),
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

export default ProfileByUsername