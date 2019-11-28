"use strict";
module.exports = (sequelize, DataTypes) => {
  const Auth = sequelize.define(
    "Auth",
    {
      user: DataTypes.STRING,
      token: DataTypes.STRING
    },
    {}
  );
  Auth.associate = function() {
    // associations can be defined here
  };
  return Auth;
};
