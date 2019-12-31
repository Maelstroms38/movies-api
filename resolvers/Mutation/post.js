const { Posts } = require('../../models');

const post = {
  async addPost(_, { title, link, imageUrl }) {
    const post = await Posts.create({ title, link, imageUrl });
    return post.id;
  },

  async editPost(_, { id, title, link, imageUrl }) {
    const [updated] = await Posts.update(
      { title, link, imageUrl },
      {
        where: { id: id }
      }
    );
    if (updated) {
      const updatedPost = await Posts.findOne({ where: { id: id } });
      return updatedPost;
    }
    return new Error('Post not updated');
  },

  async deletePost(_, { id }) {
    const deleted = await Posts.destroy({
      where: { id: id }
    });
    if (deleted) {
      return id;
    }
    return new Error('Post not deleted');
  },
}

module.exports = {
  post
};
