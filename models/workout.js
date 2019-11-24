'use strict';
module.exports = (sequelize, DataTypes) => {
  const Workout = sequelize.define('Workout', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});
  Workout.associate = function(models) {
    // associations can be defined here
    Workout.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Workout.hasMany(models.Vote, {
      foreignKey: 'userId',
      as: 'votes',
    });
  };
  return Workout;
};