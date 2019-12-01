"use strict";
module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define(
    "Company",
    {
      company_name: DataTypes.STRING,
      company_code: DataTypes.STRING,
      callballback_uri: DataTypes.STRING
    },
    {}
  );
  Company.associate = function(models) {
    // associations can be defined here
    Company.hasMany(models.Accounts, {
      foreignKey: "companyId"
    });
  };
  return Company;
};
