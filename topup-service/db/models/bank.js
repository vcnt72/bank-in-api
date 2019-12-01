"use strict";
module.exports = (sequelize, DataTypes) => {
  const Bank = sequelize.define(
    "Bank",
    {
      name: DataTypes.STRING,
      code: DataTypes.STRING,
      callbackURI: DataTypes.STRING
    },
    {}
  );
  Bank.associate = function(models) {
    // associations can be defined here
  };
  return Bank;
};
