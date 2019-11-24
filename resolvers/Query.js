const { User, Workout, Vote, sequelize } = require('../models');
const { getUserId } = require('../utils');

const feed = async (_, args, context) => {
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
};

const currentUser = async (_, args, context) => {
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
};

module.exports = {
  feed,
  currentUser
}