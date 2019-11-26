const { User, Category, Movie, Vote, sequelize } = require('../models');
const { getUserId } = require('../utils');

const feed = async (_, args, context) => {
  const {categoryId} = args;
  const movies = await Movie.findAll({
    where: categoryId ? {categoryId} : {},
    include: [
      {
        model: Vote,
        as: 'votes', 
        include: [{
          model: User,
          as: 'user',
        }]
      },
      { 
        model: Category,
        as: 'category'
      }
    ]
  });
  return movies;
};

const categories = async (_, args, context) => {
  const categories = await Category.findAll({
    where: {},
  });
  return categories;
};

const currentUser = async (_, args, context) => {
  const userId = getUserId(context);
  if (userId) {
    const user = await User.findOne({
      where: { id: userId },
      include: [
        {
          model: Vote,
          as: 'votes',
          include: [{
            model: Movie,
            as: 'movie',
            include: [{
              model: Category,
              as: 'category',
            }]
          }]
        },
      ]
    });
    return user;
  }
};

module.exports = {
  feed,
  categories,
  currentUser,
}