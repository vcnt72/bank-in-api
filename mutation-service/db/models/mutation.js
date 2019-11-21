"use strict";
const moment = require("moment");
module.exports = (sequelize, DataTypes) => {
  const Mutation = sequelize.define(
    "Mutation",
    {
      code: {
        type: DataTypes.STRING
      },
      recipient: {
        type: DataTypes.STRING
      },
      date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        get() {
          return moment(this.getDataValue("date")).format("DD/MM/YYYY h:mm:ss");
        }
      },
      user: {
        type: DataTypes.INTEGER
      },
      amount: {
        type: DataTypes.STRING
      }
    },
    {}
  );

  return Mutation;
};
