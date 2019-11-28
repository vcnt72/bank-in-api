"use strict";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      fullName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "waiting"
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "user"
      }
    },
    {
      hooks: {
        beforeCreate: async user => {
          try {
            const hashPassword = await bcrypt.hash(user.password, 8);
            // eslint-disable-next-line require-atomic-updates
            user.password = hashPassword;
          } catch (error) {
            console.log(error);
          }
        }
      }
    }
  );

  // eslint-disable-next-line no-unused-vars
  User.associate = function(models) {
    // associations can be defined here
  };

  //instance method for generating auth token
  User.prototype.generateAuthToken = async function() {
    const user = this;

    const token = jwt.sign(
      {
        id: user.id,
        phoneNumber: user.phoneNumber
      },
      "secret"
    );

    user.token = token;

    await user.save();

    return token;
  };

  return User;
};
