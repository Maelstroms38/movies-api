const { ApolloServer, gql } = require('apollo-server-express');
const { createServer } = require('http');
const { makeExecutableSchema } = require('graphql-tools');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const resolvers = require('../resolvers')

const { User, Movie, Vote, sequelize } = require('../models');

const port = process.env.PORT || 4000;

const typeDefs = gql`
  type Query {
    currentUser: User
    feed(categoryId: ID): [Movie!]!
    categories: [Category!]!
  }
  type Mutation {
    signUp(email: String!, password: String!, username: String!): AuthPayload
    signIn(email: String, username: String, password: String!): AuthPayload
    addVote(movieId: ID!): ID
    removeVote(movieId: ID!): ID
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

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const server = new ApolloServer({
  schema,
  context: request => {
    return {
      ...request
    };
  },
  introspection: true,
  playground: {
    endpoint: '/graphql'
  }
});

const app = express();
const server = createServer(app);
apolloServer.applyMiddleware({ app });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

server.listen({port}, () => console.log(`Server is running at http://localhost:${port}`))