'use strict';
module.exports = (sequelize, DataTypes) => {
  const Movie = sequelize.define('Movie', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    categoryId: DataTypes.INTEGER
  }, {});
  Movie.associate = function(models) {
    // associations can be defined here
    Movie.hasMany(models.Vote, {
      foreignKey: 'movieId',
      as: 'votes',
    });
    Movie.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category',
    });
  };
  return Movie;
};