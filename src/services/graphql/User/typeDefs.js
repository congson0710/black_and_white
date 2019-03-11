const typeDefs = `
  type User {
    id: Int!
    email: String!
    password: String!
  }

  type Mutation{
    login(email: String!, password: String!): User!
    signUp(email: String!, password: String!, userName: String!): User!
  }
`
export default typeDefs
