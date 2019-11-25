'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Categories', [{
        "title": 'Action',
        "description": '',
        "createdAt": new Date(),
        "updatedAt": new Date(),
      },
      {
        "title": 'Adventure',
        "description": '',
        "createdAt": new Date(),
        "updatedAt": new Date(),
      },
      {
        "title": 'Animation',
        "description": '',
        "createdAt": new Date(),
        "updatedAt": new Date(),
      },
      {
        "title": 'Comedy',
        "description": '',
        "createdAt": new Date(),
        "updatedAt": new Date(),
      },
      {
        "title": 'Drama',
        "description": '',
        "createdAt": new Date(),
        "updatedAt": new Date(),
      },
      {
        "title": 'Fantasy',
        "description": '',
        "createdAt": new Date(),
        "updatedAt": new Date(),
      },
      {
        "title": 'History',
        "description": '',
        "createdAt": new Date(),
        "updatedAt": new Date(),
      },
      {
        "title": 'Horror',
        "description": '',
        "createdAt": new Date(),
        "updatedAt": new Date(),
      },
      {
        "title": 'Mystery',
        "description": '',
        "createdAt": new Date(),
        "updatedAt": new Date(),
      },
      {
        "title": 'Romance',
        "description": '',
        "createdAt": new Date(),
        "updatedAt": new Date(),
      },
      {
        "title": 'Music',
        "description": '',
        "createdAt": new Date(),
        "updatedAt": new Date(),
      },
      {
        "title": 'Science Fiction',
        "description": '',
        "createdAt": new Date(),
        "updatedAt": new Date(),
      },
      {
        "title": 'Thriller',
        "description": '',
        "createdAt": new Date(),
        "updatedAt": new Date(),
      },
      {
        "title": 'Western',
        "description": '',
        "createdAt": new Date(),
        "updatedAt": new Date(),
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Categories', null, {});
  }
};
