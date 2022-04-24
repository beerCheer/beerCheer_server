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
    await queryInterface.bulkInsert("Comments", [
      {
        userId: 1,
        beerId: 1,
        content: "nickname test1 writing test content",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        beerId: 2,
        content: "nickname test2 writing test content",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 3,
        beerId: 3,
        content: "nickname test3 writing test content",
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
    await queryInterface.bulkDelete("Comments", null, {});
  },
};
