const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { execute, subscribe } = require('graphql');
const { createServer } = require('http');
const { makeExecutableSchema } = require('graphql-tools');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
    addPost(title: String!, description: String!): Workout!
    editPost(id: Int!, title: String!, description: String!): Workout!
    deletePost(id: Int!): Int
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
  Query: {
    currentUser: async (_, args, context) => {
      const userId = getUserId(context);
      if (userId) {
        const user = await User.findOne({
          where: { id: userId },
          include: [
            {
              model: Workout,
              as: 'workouts'
            }
          ]
        });
        return user;
      }
    },
    feed: async (_, args, context) => {
      const workouts = await Workout.findAll({
        where: {},
        include: [
          {
            model: Vote,
            as: 'votes'
          }
        ]
      });
      return workouts;
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
        throw new Error(err.message);
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
          throw new Error('Invalid credentials');
        }
        throw new Error('Invalid credentials');
      } catch (err) {
        throw new Error(err.message);
      }
    },
    addPost: async (_, { title, description }, context) => {
      const userId = getUserId(context);
      if (userId) {
        const project = await Workout.create({ title, description, userId });
        return project;
      }
      throw new Error('Not authorized');
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
        throw new Error('Workout not updated');
      }
      throw new Error('Not authorized');
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
        throw new Error('Workout not deleted');
      }
      throw new Error('Not authorized');
    },
    addVote: async (_, { workoutId }, context) => {
      const userId = getUserId(context);
      if (userId) {
        const user = await User.findOne({
          where: { id: userId },
          include: [
            {
              model: Vote,
              as: 'votes'
            },
            {
              model: Workout,
              as: 'workouts'
            }
          ]
        });
        if (user.votes.find(vote => vote.userId == userId)) {
          throw new Error('Cannot vote twice');
        }
        if (user.workouts.find(workout => workout.id == workoutId)) {
          throw new Error('Cannot vote on your own workouts');
        }
        const newVote = await Vote.create({ userId, workoutId });
        return newVote.id;
      }
      throw new Error('Not authorized');
    },
    removeVote: async (_, { workoutId }, context) => {
      const userId = getUserId(context);
      const vote = await Vote.findOne({ where: { workoutId } });
      if (userId && vote && userId == vote.userId) {
        const deleted = await Vote.destroy({
          where: { userId, workoutId }
        });
        if (deleted) {
          return 'Removed Vote';
        }
        throw new Error('Not authorized');
      }
      throw new Error('Vote not found');
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
    throw new Error('Not authenticated');
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
