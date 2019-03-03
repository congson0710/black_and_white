import { ApolloServer, gql, AuthenticationError } from 'apollo-server'
import { find, filter } from 'lodash'
import get from 'lodash/fp/get'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

import { Author, Book } from './store'

const client = jwksClient({
  jwksUri: 'https://blackandwhite.auth0.com/.well-known/jwks.json',
})

const getKey = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key.publicKey || key.rsaPublicKey
    callback(null, signingKey)
  })
}

const options = {
  audience: '09FgOADNsF40LastIsFsyNZeCUP55Irc',
  issuer: 'https://blackandwhite.auth0.com/',
}

const typeDefs = gql`
  type Author {
    id: Int!
    first_name: String!
    last_name: String!
    books: [Book]!
  }

  type Book {
    id: Int!
    title: String!
    cover_image_url: String!
    average_rating: Float!
    author: Author!
  }

  type Query {
    books: [Book!]!
    book(id: Int!): Book!
    author(id: Int!): Author!
  }

  type User {
    id: Int!
    email: String!
    password: String!
  }

  type Mutation {
    addBook(
      title: String!
      cover_image_url: String!
      average_rating: Float!
      authorId: Int!
    ): Book!

    login(email: String!, password: String!): User!
  }
`

let book_id = 5
let author_id = 3

const resolvers = {
  Query: {
    books: () => Book.findAll(),
    book: (_, args) => Book.find({ where: args }),
    author: (_, args) => Author.find({ where: args }),
  },
  Mutation: {
    addBook: async (
      _,
      { title, cover_image_url, average_rating, authorId },
      { user }
    ) => {
      try {
        const email = await user
        const bool = await Book.create({
          title,
          cover_image_url,
          average_rating,
          authorId,
        })

        return book
      } catch (error) {
        throw new AuthenticationError('You must be logged in to do this')
      }
    },
    login: async (_, args) => {
      const hash = crypto.createHash('sha256')
      console.log('args', hash.update(get('password')(args)).digest('hex'))
    },
  },
  Author: {
    books: author => author.getBooks(),
  },
  Book: {
    author: book => book.getAuthor(),
  },
}

const context = ({ req }) => {
  // simple auth check on every request
  const token = req.headers.authorization
  const user = new Promise((resolve, reject) => {
    jwt.verify(token, getKey, options, (err, decoded) => {
      if (err) {
        return reject(err)
      }
      resolve(decoded.email)
    })
  })

  user.then(user => console.log('user', user))

  return {
    user,
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // context,
})

server.listen().then(({ url }) => {
  console.log(`Server is ready at ${url}`)
})
