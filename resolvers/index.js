const Query = require('./Query');
const { auth } = require('./Mutation/auth');
const { vote } = require('./Mutation/vote');

module.exports = {
  Query,
  Mutation: {
    ...auth,
    ...vote
  }
};
