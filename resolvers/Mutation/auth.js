const { User, sequelize } = require('../../models');
const { APP_SECRET } = require('../utils');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const auth = {
  async signUp(_, { username, email, password }) {
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

  async signIn(_, { username, email, password }) {
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
}

module.exports = { auth }