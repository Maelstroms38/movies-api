const { Post, User } = require('../../models');
const { getUserId } = require('../utils');
const { pubSub } = require('../../src/pubSub');

const post = {
  async addPost(_, { title, link, imageUrl }, context) {
    const userId = getUserId(context);
    if (userId) {
      const post = await Post.create({ userId, title, link, imageUrl });
      const user = await User.findByPk(userId);
      pubSub.publish('postAdded', {
        postAdded: { id: post.id, title, link, imageUrl, author: user }
      });
      return post.id;
    }
    throw new Error('Not authorized');
  },

  async editPost(_, { id, title, link, imageUrl }, context) {
    const userId = getUserId(context);
    if (userId) {
      const [updated] = await Post.update(
        { userId, title, link, imageUrl },
        {
          where: { id: id, userId: userId }
        }
      );
      if (updated) {
        const updatedPost = await Post.findByPk(id);
        pubSub.publish('postEdited', { postEdited: updatedPost });
        return updatedPost;
      }
      throw new Error('Post not updated');
    }
    throw new Error('Not authorized');
  },

  async deletePost(_, { id }, context) {
    const userId = getUserId(context);
    if (userId) {
      const deleted = await Post.destroy({
        where: { id: id, userId: userId }
      });
      if (deleted) {
        pubSub.publish('postDeleted', { postDeleted: id });
        return id;
      }
      throw new Error('Post not deleted');
    }
    throw new Error('Not authorized');
  },
}

module.exports = {
  post
};
