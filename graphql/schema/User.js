const types = `
  type User {
    _id: ID!
    email: String!
    password: String
    createdEvents: [Event!]
  }
  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
  }
`;

const inputs = `
    input UserInput {
    email: String!
    password: String!
  }
`;

const queries = `
    login(email: String!, password: String!): AuthData!
`;

const mutations = `
createUser(userInput: UserInput): User
`;

exports.types               = types;
exports.queries             = queries;
exports.mutations           = mutations;
exports.inputs              = inputs;