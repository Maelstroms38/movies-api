const { ApolloServer, gql } = require('apollo-server-express');
const { makeExecutableSchema } = require("graphql-tools");
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { execute, subscribe } = require('graphql');
const { createServer } = require('http');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { pubSub } = require('./pubSub');

const resolvers = require('../resolvers');

const port = process.env.PORT || 4000;

const typeDefs = gql`
  type Query {
    currentUser: User
    feed(categoryId: ID): [Movie!]!
    categories: [Category!]!
    posts: [Post]
  }
  type Mutation {
    signUp(email: String!, password: String!, username: String!): AuthPayload
    signIn(email: String, username: String, password: String!): AuthPayload
    addVote(movieId: ID!): ID
    removeVote(movieId: ID!): ID
    addPost(title: String!, link: String!, imageUrl: String!): ID
    editPost(id: ID!, title: String!, link: String!, imageUrl: String!): Post
    deletePost(id: ID!): ID
  }
  type Subscription {
    postAdded: Post
    postEdited: Post
    postDeleted: ID
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
    posts: [Post]
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
  type Post {
    title: String!
    link: String!
    imageUrl: String
    id: ID!
    author: User
  }
`;

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const apolloServer = new ApolloServer({
  schema,
  context: request => {
    return {
      ...request,
      pubSub
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

server.listen({ port }, () => {
  console.log(`Server is running at http://localhost:${port}/graphql`);
  new SubscriptionServer(
    {
      schema,
      execute,
      subscribe,
      keepAlive: 10000
    },
    {
      server: server
    }
  );
});
