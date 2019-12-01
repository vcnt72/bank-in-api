"use strict";
module.exports = (sequelize, DataTypes) => {
  const Accounts = sequelize.define(
    "Accounts",
    {
      name: DataTypes.STRING,
      balance: DataTypes.INTEGER
    },
    {}
  );
  Accounts.associate = function(models) {
    // associations can be defined here
  };
  return Accounts;
};
