'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Movies', [
      {
          "title": "Frozen II",
          "imageUrl": "https://image.tmdb.org/t/p/w780/qdfARIhgpgZOBh3vfNhWS4hmSo3.jpg",
          "description": "Elsa, Anna, Kristoff and Olaf are going far in the forest to know the truth about an ancient mystery of their kingdom..",
          "categoryId": 3,
          "createdAt": new Date(),
          "updatedAt": new Date(),
      },
      {
          "title": "Spider-Man: Far From Home",
          "imageUrl": "https://image.tmdb.org/t/p/w780/lcq8dVxeeOqHvvgcte707K0KVx5.jpg",
          "description": "Peter Parker and his friends go on a summer trip to Europe. However, they will hardly be able to rest - Peter will have to agree to help Nick Fury uncover the mystery of creatures that cause natural disasters and destruction throughout the continent.",
          "categoryId": 1,
          "createdAt": new Date(),
          "updatedAt": new Date(),
      },
      {
          "title": "Joker",
          "imageUrl": "https://image.tmdb.org/t/p/w780/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
          "description": "During the 1980s, a failed stand-up comedian is driven insane and turns to a life of crime and chaos in Gotham City while becoming an infamous psychopathic crime figure.",
          "categoryId": 8,
          "createdAt": new Date(),
          "updatedAt": new Date(),
      },
      {
          "title": "Once Upon a Time... in Hollywood",
          "imageUrl": "https://image.tmdb.org/t/p/w780/8j58iEBw9pOXFD2L0nt0ZXeHviB.jpg",
          "description": "A faded television actor and his stunt double strive to achieve fame and success in the film industry during the final years of Hollywood's Golden Age in 1969 Los Angeles.",
          "categoryId": 14,
          "createdAt": new Date(),
          "updatedAt": new Date(),
      },
      {
          "title": "The Lion King",
          "imageUrl": "https://image.tmdb.org/t/p/w780/2bXbqYdUdNVa8VIWXVfclP2ICtT.jpg",
          "description": "Simba idolizes his father, King Mufasa, and takes to heart his own royal destiny. But not everyone in the kingdom celebrates the new cub's arrival. Scar, Mufasa's brother and a former heir to the throne has plans of his own.",
          "categoryId": 3,
          "createdAt": new Date(),
          "updatedAt": new Date(),
      },
      {
          "title": "Ford v Ferrari",
          "imageUrl": "https://image.tmdb.org/t/p/w780/6ApDtO7xaWAfPqfi2IARXIzj8QS.jpg",
          "description": "American car designer Carroll Shelby and the British-born driver Ken Miles work together to battle corporate interference, the laws of physics, and their own personal demons to build a revolutionary race car for Ford Motor Company.",
          "categoryId": 13,
          "createdAt": new Date(),
          "updatedAt": new Date(),
      },
      {
          "title": "Aladdin",
          "imageUrl": "https://image.tmdb.org/t/p/w780/3iYQTLGoy7QnjcUYRJy4YrAgGvp.jpg",
          "description": "A kindhearted street urchin named Aladdin embarks on a magical adventure after finding a lamp that releases a wisecracking genie while a power-hungry Grand Vizier vies for the same lamp that has the power to make their deepest wishes come true.",
          "categoryId": 3,
          "createdAt": new Date(),
          "updatedAt": new Date(),
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Movies', null, {});
  }
};
