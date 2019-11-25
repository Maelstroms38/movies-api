const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { execute, subscribe } = require('graphql');
const { createServer } = require('http');
const { makeExecutableSchema } = require('graphql-tools');
const bodyParser = require('body-parser');
const Mutation = require('./resolvers/Mutation');
const Query = require('./resolvers/Query');

const PORT = process.env.PORT || 3000;

const { User, Movie, Vote, sequelize } = require('./models');

const typeDefs = gql`
  type Query {
    currentUser: User
    feed(categoryId: Int): [Movie!]!
    categories: [Category!]!
  }
  type Mutation {
    signUp(email: String!, password: String!, username: String!): AuthPayload
    signIn(email: String, username: String, password: String!): AuthPayload
    addVote(movieId: Int!): Int
    removeVote(movieId: Int!): Int
  }
  type AuthPayload {
    token: String
    user: User
  }
  type User {
    id: ID!
    username: String!
    email: String!
    votes: [Vote!]!
  }
  type Category {
    id: ID!
    title: String!
    description: String
  }
  type Movie {
    id: ID!
    title: String!
    description: String!
    category: Category
    imageUrl: String!
    votes: [Vote!]!
  }
  type Vote {
    id: ID!
    movie: Movie
    user: User
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
