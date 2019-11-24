const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { execute, subscribe } = require('graphql');
const { createServer } = require('http');
const { makeExecutableSchema } = require('graphql-tools');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 3000;

const { User, Workout, sequelize } = require('./models');
const APP_SECRET = 'React-Native-GraphQL';

const typeDefs = gql`
  type Query {
    currentUser: User
  }
  type Mutation {
    signUp(email: String!, password: String!, username: String!): AuthPayload
    signIn(email: String, username: String, password: String!): AuthPayload
    addPost(title: String!, description: String!): Workout!
    editPost(id: Int!, title: String!, description: String!): Workout!
    deletePost(id: Int!): Int
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
  }
  type Workout {
    id: ID!
    title: String!
    description: String!
    userId: Int!
  }
`;

const resolvers = {
  Query: {
    currentUser: async (_, args, context) => {
      const userId = getUserId(context);
      if (userId) {
        const user = await User.findOne({ where: { id: userId } });
        const workouts = await Workout.findAll({ where: { userId } });
        user.workouts = workouts;
        return user;
      }
    }
  },
  Mutation: {
    signUp: async (_, { username, email, password }) => {
      try {
        const password_digest = await bcrypt.hash(password, 10);
        const user = await User.create({
          username,
          email,
          password_digest
        });
        const payload = {
          id: user.id,
          username: user.username,
          email: user.email
        };

        const token = jwt.sign(payload, APP_SECRET);
        return { user, token };
      } catch (err) {
        return new Error(err.message);
      }
    },
    signIn: async (_, { username, email, password }) => {
      try {
        if (username || email) {
          const user = username
            ? await User.findOne({
                where: {
                  username
                }
              })
            : await User.findOne({
                where: {
                  email
                }
              });

          if (await bcrypt.compare(password, user.dataValues.password_digest)) {
            const payload = {
              id: user.id,
              username: user.username,
              email: user.email
            };

            const token = jwt.sign(payload, APP_SECRET);
            return { user, token };
          }
          return new Error('Invalid credentials');
        }
        return new Error('Invalid credentials');
      } catch (err) {
        return new Error(err.message);
      }
    },
    addPost: async (_, { title, description }, context) => {
      const userId = getUserId(context);
      if (userId) {
        const project = await Workout.create({ title, description, userId });
        return project;
      }
      return new Error('Not authorized');
    },
    editPost: async (_, { id, title, description }, context) => {
      const userId = getUserId(context);
      const workout = await Workout.findOne({ where: { id: id } });
      if (userId && userId == workout.userId) {
        const [updated] = await Workout.update(
          { title, description },
          {
            where: { id: id }
          }
        );
        if (updated) {
          const updatedPost = await Workout.findOne({ where: { id: id } });
          return updatedPost;
        }
        return new Error('Workout not updated');
      }
      return new Error('Not authorized');
    },
    deletePost: async (_, { id }, context) => {
      const userId = getUserId(context);
      const workout = await Workout.findOne({ where: { id: id } });
      if (userId && userId == workout.userId) {
        const deleted = await Workout.destroy({
          where: { id: id }
        });
        if (deleted) {
          return id;
        }
        return new Error('Workout not deleted');
      }
      return new Error('Not authorized');
    }
  }
};

function getUserId(context) {
  const authorization = context.req.headers['authorization'];
  try {
    if (authorization) {
      const token = authorization.replace('Bearer ', '');
      const user = jwt.verify(token, APP_SECRET);
      return user.id;
    }
  } catch (err) {
    return new Error('Not authenticated');
  }
}

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
