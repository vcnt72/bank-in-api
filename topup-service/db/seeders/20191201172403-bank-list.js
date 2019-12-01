"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Banks",
      [
        {
          name: "Bank A",
          code: 990,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Bank B",
          code: 991,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Bank C",
          code: 992,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("People", null, {});
  }
};
