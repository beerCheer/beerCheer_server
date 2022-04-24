"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert("Favorites", [
      {
        userId: 1,
        beerId: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        beerId: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 3,
        beerId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Favorites", null, {});
  },
};
