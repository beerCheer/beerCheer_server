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
    await queryInterface.bulkInsert("Preferences", [
      {
        userId: 1,
        beerId: 5,
        malt: "Lager Malt",
        quantity: 6.63,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        beerId: 3,
        malt: "Propino Pale Malt",
        quantity: 1.63,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 3,
        beerId: 4,
        malt: "Extra Pale",
        quantity: 4.58,
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
    await queryInterface.bulkDelete("Preferences", null, {});
  },
};
