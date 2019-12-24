'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Categories',
      [
        {
          title: 'Action',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Adventure',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Animation',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Comedy',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Drama',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Fantasy',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'History',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Horror',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Mystery',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Romance',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Music',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Science Fiction',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Thriller',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Western',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Categories', null, {});
  }
};
