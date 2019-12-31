const { Posts } = require('../../models');
const { getUserId } = require('../utils');

const post = {
  async addPost(_, { title, link, imageUrl }, context) {
    const userId = getUserId(context);
    if (userId) {
      const post = await Posts.create({ userId, title, link, imageUrl });
      return post.id;
    }
    throw new Error('Not authorized');
  },

  async editPost(_, { id, title, link, imageUrl }, context) {
    const userId = getUserId(context);
    if (userId) {
      const [updated] = await Posts.update(
        { userId, title, link, imageUrl },
        {
          where: { id: id, userId: userId }
        }
      );
      if (updated) {
        const updatedPost = await Posts.findOne({ where: { id: id } });
        return updatedPost;
      }
      throw new Error('Post not updated');
    }
    throw new Error('Not authorized');
  },

  async deletePost(_, { id }, context) {
    const userId = getUserId(context);
    if (userId) {
      const deleted = await Posts.destroy({
        where: { id: id, userId: userId }
      });
      if (deleted) {
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
