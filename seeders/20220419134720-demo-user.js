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
    await queryInterface.bulkInsert("Users", [
      {
        nickname: "test1",
        email: "test1@test.com",
        isPreferenceOrRateChecked: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nickname: "test2",
        email: "test2@test.com",
        isPreferenceOrRateChecked: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nickname: "test3",
        email: "test3@test.com",
        isPreferenceOrRateChecked: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nickname: "test4",
        email: "test4@test.com",
        isPreferenceOrRateChecked: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nickname: "test5",
        email: "test5@test.com",
        isPreferenceOrRateChecked: false,
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
    await queryInterface.bulkDelete("Users", null, {});
  },
};
