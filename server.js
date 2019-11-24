const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { execute, subscribe } = require('graphql');
const { createServer } = require('http');
const { makeExecutableSchema } = require('graphql-tools');
const bodyParser = require('body-parser');
const Mutation = require('./resolvers/Mutation');
const Query = require('./resolvers/Query');

const PORT = process.env.PORT || 3000;

const { User, Workout, Vote, sequelize } = require('./models');
const APP_SECRET = 'React-Native-GraphQL';

const typeDefs = gql`
  type Query {
    currentUser: User
    feed: [Workout!]!
  }
  type Mutation {
    signUp(email: String!, password: String!, username: String!): AuthPayload
    signIn(email: String, username: String, password: String!): AuthPayload
    addWorkout(title: String!, description: String!): Workout!
    editWorkout(id: Int!, title: String!, description: String!): Workout!
    deleteWorkout(id: Int!): Int
    addVote(workoutId: Int!): Int
    removeVote(workoutId: Int!): Int
  }
  type AuthPayload {
    token: String
    user: User
  }
  type User {
    id: ID!
    username: String!
    email: String!
    workouts: [Workout!]!
    votes: [Vote!]!
  }
  type Workout {
    id: ID!
    title: String!
    description: String!
    userId: Int!
    votes: [Vote!]!
  }
  type Vote {
    id: ID!
    workoutId: ID!
    userId: ID!
  }
`;

const resolvers = {
  Query,
  Mutation,
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const apolloServer = new ApolloServer({
  schema,
  context: request => {
    return {
      ...request
    };
  },
  uploads: false,
  introspection: true,
  playground: {
    endpoint: '/graphql',
    settings: {
      'editor.theme': 'light'
    }
  }
});

const app = express();
app.use(bodyParser.json());
const server = createServer(app);
apolloServer.applyMiddleware({ app });

server.listen({ port: PORT }, () => {
  console.log(`Express server listening on port ${PORT}`);
});
