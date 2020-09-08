const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Session {
    _id: ID!
    name: String!
    address: String!
    port: String!
    type: String!
    user: User!
    suser: String
    password: String
}

type User {
    _id: ID!
    email: String!
    password: String!
    username: String!
    access: Boolean!
    admin: Boolean!
    sessions: [Session!]
}

type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
    username: String!
    email: String!
    access: Boolean!
    admin: Boolean!
}

input SessionInput {
    name: String!
    address: String!
    port: String
    suser: String
    password: String
    type: String!
}

input UserInput {
    email: String!
    password: String!
    username: String!
}

type RootQuery {
    sessions(user: String!): [Session!]
    users: [User!]
    login(email: String!, password: String!): AuthData!
}

type RootMutation {
    createSession(sessionInput: SessionInput): Session
    deleteSession(sessionId: String!, user: String!): [Session]
    createUser(userInput: UserInput): User
    editUser(email: String!, access: Boolean!, admin: Boolean!): User
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
