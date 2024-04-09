const { buildSchema } = require('graphql');
//import * as User from './User';
const User = require('./User');

const types     = [];
const queries   = [];
const mutations = [];
const inputs    = [];

const schemas = [User];

schemas.forEach((s) => {
  types.push(s.types);
  queries.push(s.queries);
  mutations.push(s.mutations);
  inputs.push(s.inputs);
});

module.exports = buildSchema(`

type Booking {
    _id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
}


type Event {
  _id: ID!
  title: String!
  description: String!
  price: Float!
  date: String!
  creator: User!
}

${types.join('\n')}

input EventInput {
  title: String!
  description: String!
  price: Float!
  date: String!
}

${inputs.join('\n')}

type RootQuery {
    events: [Event!]!
    bookings: [Booking!]!
    ${queries.join('\n')}
}

type RootMutation {
    createEvent(eventInput: EventInput): Event
    ${mutations.join('\n')}
    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Event!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);