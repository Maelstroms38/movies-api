const { User } = require('../models');
const Query = require('./Query');
const { auth } = require('./Mutation/auth');
const { vote } = require('./Mutation/vote');
const { post } = require('./Mutation/post');
const Subscription = require('./Subscription');

module.exports = {
  Query,
  Mutation: {
    ...auth,
    ...vote,
    ...post,
  },
  Subscription,
};
