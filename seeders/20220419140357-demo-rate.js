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
    await queryInterface.bulkInsert("Rates", [
      {
        userId: 1,
        rate: 1,
        beerId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        rate: 2,
        beerId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        rate: 3,
        beerId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        rate: 4,
        beerId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        rate: 5,
        beerId: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        rate: 1,
        beerId: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        rate: 2,
        beerId: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        rate: 3,
        beerId: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        rate: 4,
        beerId: 9,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        rate: 5,
        beerId: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 3,
        rate: 5,
        beerId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 3,
        rate: 4,
        beerId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 3,
        rate: 3,
        beerId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 3,
        rate: 2,
        beerId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 3,
        rate: 1,
        beerId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 4,
        rate: 3,
        beerId: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 4,
        rate: 5,
        beerId: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 4,
        rate: 5,
        beerId: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 4,
        rate: 4,
        beerId: 9,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 4,
        rate: 5,
        beerId: 10,
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
    await queryInterface.bulkDelete("Rates", null, {});
  },
};
