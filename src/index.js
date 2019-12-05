const { GraphQLServer } = require('graphql-yoga');
const resolvers = require('../resolvers')

const { User, Movie, Vote, sequelize } = require('../models');

const typeDefs = `
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

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: request => {
    return {
      ...request
    };
  },
});

server.start(() => console.log(`Server is running at http://localhost:4000`))