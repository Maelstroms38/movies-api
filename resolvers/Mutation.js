const { User, Movie, Vote, sequelize } = require('../models');
const { getUserId, APP_SECRET } = require('../utils');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signUp = async (_, { username, email, password }) => {
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
};

const signIn = async (_, { username, email, password }) => {
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
};

const addVote = async (_, { movieId }, context) => {
  const userId = getUserId(context);
  if (userId) {
    const user = await User.findOne({
      where: { id: userId },
      include: [
        {
          model: Vote,
          as: 'votes'
        }
      ]
    });
    if (user.votes.find(vote => vote.movieId == movieId)) {
      throw new Error('Cannot vote twice');
    }
    const newVote = await Vote.create({ userId, movieId });
    return newVote.id;
  }
  throw new Error('Not authorized');
};

const removeVote = async (_, { movieId }, context) => {
  const userId = getUserId(context);
  const vote = await Vote.findOne({ where: { userId, movieId } });
  if (userId && vote && userId == vote.userId) {
    const deleted = await vote.destroy();
    if (deleted) {
      return vote.id;
    }
    throw new Error('Not authorized');
  }
  throw new Error('Vote not found');
};


module.exports = {
  signUp,
  signIn,
  addVote,
  removeVote
}