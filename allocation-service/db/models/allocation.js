"use strict";
module.exports = (sequelize, DataTypes) => {
  const Allocation = sequelize.define(
    "Allocation",
    {
      name: {
        type: DataTypes.STRING
      },
      category: {
        type: DataTypes.STRING
      },
      balance: {
        type: DataTypes.INTEGER
      },
      user: {
        type: DataTypes.STRING,
        validate: {
          isNumeric: true
        }
      }
    },
    {}
  );

  return Allocation;
};
