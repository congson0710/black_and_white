import { ApolloServer, gql, AuthenticationError } from 'apollo-server'
import get from 'lodash/fp/get'
import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

import { Author, Book, User } from './services/sequelize'
import schema from './services/graphql'

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

  return {
    user,
  }
}

const server = new ApolloServer({
  schema,
})

server.listen().then(({ url }) => {
  console.log(`Server is ready at ${url}`)
})
