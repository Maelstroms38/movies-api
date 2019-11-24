const { User, Workout, Vote, sequelize } = require('../models');
const { getUserId } = require('../utils');
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

const addWorkout = async (_, { title, description }, context) => {
  const userId = getUserId(context);
  if (userId) {
    const project = await Workout.create({ title, description, userId });
    return project;
  }
  throw new Error('Not authorized');
};

const editWorkout = async (_, { id, title, description }, context) => {
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
};

const deleteWorkout = async (_, { id }, context) => {
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
};

const addVote = async (_, { workoutId }, context) => {
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
};

const removeVote = async (_, { workoutId }, context) => {
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
};


module.exports = {
  signUp,
  signIn,
  addWorkout,
  editWorkout,
  deleteWorkout,
  addVote,
  removeVote
}