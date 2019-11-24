'use strict';
module.exports = (sequelize, DataTypes) => {
  const Vote = sequelize.define('Vote', {
    userId: DataTypes.INTEGER,
    workoutId: DataTypes.INTEGER
  }, {});
  Vote.associate = function(models) {
    // associations can be defined here
    Vote.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Vote.belongsTo(models.Workout, {
      foreignKey: 'workoutId',
      onDelete: 'CASCADE'
    });
  };
  return Vote;
};