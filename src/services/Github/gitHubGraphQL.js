import { gql } from '@apollo/client'

export const SEARCH_USERS_QUERY = gql`
  query SearchUsers($userQuery: String!) {
    search(query: $userQuery, type: USER, first: 8) {
      edges {
        node {
          ... on User {
            avatarUrl
            id
            login
          }
        }
      }
    }
  }
`