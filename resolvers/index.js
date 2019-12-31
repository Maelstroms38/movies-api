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
  	__resolveReference(user, context) {
  	  return Query.currentUser(null, null, context);
    }
  }
};
