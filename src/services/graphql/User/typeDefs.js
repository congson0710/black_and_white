const typeDefs = `
  type User {
    id: Int!
    password: String!
    userName: String!
    firstName: String!
    lastName: String!
  }

  type Credential {
    token: String!
    userName: String!
  }

  type Query {
    userName: String!
    firstName: String!
    lastName: String!
  }

  type Mutation{
    login(userName: String!, password: String!): Credential!
    signUp(userName: String!, password: String!, firstName: String!, lastName: String!): User!
  }
`
export default typeDefs
