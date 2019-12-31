'use strict';
module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define('Posts', {
    title: DataTypes.STRING,
    link: DataTypes.STRING,
    imageUrl: DataTypes.STRING
  }, {});
  Posts.associate = function(models) {
    // associations can be defined here
    Posts.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };
  return Posts;
};