"use strict";
module.exports = (sequelize, DataTypes) => {
  const VirtualAccounts = sequelize.define(
    "VirtualAccounts",
    {
      companyId: DataTypes.STRING,
      phoneNumber: DataTypes.STRING
    },
    {}
  );
  VirtualAccounts.associate = function(models) {
    VirtualAccounts.belongsto(models.Company, {
      foreignKey: "companyId",
      as: "Company"
    });
    // associations can be defined here
  };
  return VirtualAccounts;
};
