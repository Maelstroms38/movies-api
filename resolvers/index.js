const { User } = require('../models');
const Query = require('./Query');
const { auth } = require('./Mutation/auth');
const { vote } = require('./Mutation/vote');
const { post } = require('./Mutation/post');

module.exports = {
  Query,
  Mutation: {
    ...auth,
    ...vote,
    ...post,
  },
  User: {
  	async __resolveReference(object) {
  	  const user = await User.findOne({
        where: { id: object.id },
      });
      return user;
    },
  },
  Post: {
    author(post) {
      return { __typename: "User", id: post.userId };
    }
  }
};
