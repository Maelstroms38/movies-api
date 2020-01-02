const { ApolloServer, gql } = require('apollo-server-express');
const { buildFederatedSchema } = require("@apollo/federation");
const { createServer } = require('http');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const resolvers = require('../resolvers');

const port = 4002;

const typeDefs = gql`
  type Post @key(fields: "id") {
    title: String!
    link: String!
    imageUrl: String
    id: ID!
    author: User @provides(fields: "id")
  }
  extend type User @key(fields: "id") {
    id: ID! @external
  }
  type Query {
    posts: [Post]
  }
  type Mutation {
    addPost(title: String!, link: String!, imageUrl: String!): ID
    editPost(id: ID!, title: String!, link: String!, imageUrl: String!): Post
    deletePost(id: ID!): ID
  }
`;

const schema = buildFederatedSchema([{
  typeDefs,
  resolvers
}]);

const apolloServer = new ApolloServer({
  schema,
  context: request => {
    return {
      ...request,
    };
  },
  introspection: false,
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
});
