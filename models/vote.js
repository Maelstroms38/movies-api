'use strict';
module.exports = (sequelize, DataTypes) => {
  const Vote = sequelize.define('Vote', {
    userId: DataTypes.INTEGER,
    movieId: DataTypes.INTEGER
  }, {});
  Vote.associate = function(models) {
    // associations can be defined here
    Vote.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      as: 'user'
    });
    Vote.belongsTo(models.Movie, {
      foreignKey: 'movieId',
      onDelete: 'CASCADE',
      as: 'movie'
    });
  };
  return Vote;
};