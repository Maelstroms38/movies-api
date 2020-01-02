'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    title: DataTypes.STRING,
    link: DataTypes.STRING,
    imageUrl: DataTypes.STRING
  }, {});
  Post.associate = function(models) {
    // associations can be defined here
    Post.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };
  return Post;
};