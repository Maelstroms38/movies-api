const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')
const { execute, subscribe } = require('graphql')
const { createServer } = require('http')
const { makeExecutableSchema } = require('graphql-tools')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const PORT = process.env.PORT || 3000

const { User, sequelize } = require('./models')
const APP_SECRET = 'React-Native-GraphQL'

const typeDefs = gql`
  type Query {
     me: User
  }
  type Mutation {
  	signUp(email: String!, password: String!, username: String!): AuthPayload
  	signIn(email: String, username: String, password: String!): AuthPayload
  	post(title: String!, description: String!, categoryId: Int!): Workout!
  }
  type AuthPayload {
    token: String
    user: User
  }
  type User {
    id: ID!
    username: String!
    email: String!
  }
  type Workout {
    id: ID!
    title: String!
    description: String!
    categoryId: Int!
  }
  type Category {
  	id: ID!
  	title: String!
  	workouts: [Workout!]!
  }
`;

const resolvers = {
   Query: {
      me: (root, args, context) => context.currentUser, 
   },
   Mutation: {
   	signUp: async (_, { username, email, password }) => {
   		try {
			const password_digest = await bcrypt.hash(password, 10)
			const user = await User.create({
				username,
				email,
				password_digest
			})
			const payload = {
				id: user.id,
				username: user.username,
				email: user.email
			}

			const token = jwt.sign(payload, APP_SECRET)
			return {user, token}
		} catch(err) {
			return new Error('Invalid credentials');
		}
   	},
   	signIn: async (_, { username, email, password }) => {
   		try {
			if (username || email) {
				const user = username ? 
					await User.findOne({
					  where: {
						username
					  }
				}) : 
					await User.findOne({
					  where: {
						email
					  }
				})

				if (await bcrypt.compare(password, user.dataValues.password_digest)) {
					const payload = {
						id: user.id,
						username: user.username,
						email: user.email
					}

					const token = jwt.sign(payload, APP_SECRET)
					return { user, token };
				} 
				return new Error('Invalid credentials');
			}
			return new Error('Invalid credentials');
		} catch {
			return new Error('Invalid credentials');
		}
      },
      post: async (parent, args, context, info) => {
      	const userId = getUserId(context)
      	console.log(userId)
	  //  return context.prisma.createLink({
	  //   url: args.url,
	  //   description: args.description,
	  //   postedBy: { connect: { id: userId } },
	  // })
      },
   },
};

function getUserId(context) {
  const Authorization = context.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const { userId } = jwt.verify(token, APP_SECRET)
    return userId
  }

  throw new Error('Not authenticated')
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  context: request => {
    return {
      ...request,
    }
  }
});

const apolloServer = new ApolloServer({
  schema, 
  uploads: false,
  introspection: true,
    playground: {
      endpoint: '/graphql',
      settings: {
        "editor.theme": "light"
      }
  }
});

const app = express();
const server = createServer(app);
apolloServer.applyMiddleware({ app })

server.listen({ port: PORT }, () => {
    console.log(`Express server listening on port ${PORT}`);
});