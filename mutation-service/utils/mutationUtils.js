const Mutation = require("../db/models").Mutation;
const Op = require("sequelize").Op;
const sequelize = require("../db/models").Sequelize;
exports.amountFormatter = (code, amount) => {
  const addPointToAmount = new Intl.NumberFormat(["ban", "id"]).format(amount);
  let formatAmount;
  if (code === "TOP" || code === "TRI") {
    formatAmount = "+ Rp" + addPointToAmount + ",00";
  } else {
    formatAmount = "- Rp" + addPointToAmount + ",00";
  }

  return formatAmount;
};

exports.codeFormatter = async userId => {
  const date = new Date();
  //Make date without separation for expected format
  try {
    const dateToCode =
      (date.getDate() + "").padStart(2, "0") +
      "" +
      (date.getMonth() + 1) +
      "" +
      //slice string to get 2 last digit from the year
      date
        .getFullYear()
        .toString()
        .slice(2, 4);

    const countTransaction = await Mutation.count({
      where: {
        [Op.and]: [
          {
            user: userId
          },
          {
            where: sequelize.where(
              sequelize.fn("date", sequelize.col("createdAt")),
              "=",
              sequelize.literal("CURRENT_DATE")
            )
          }
        ]
      }
    });

    console.log(countTransaction);
    let date_count;
    //Check if the day has no transaction
    if (countTransaction === 0) {
      //Using padstart to fill 0 in front of number
      //first transaction of the day
      //"" + number was to convert number to string
      date_count = ("" + 1).padStart(3, "0");
    } else {
      //every next transaction
      date_count = ("" + (countTransaction + 1)).padStart(3, "0");
    }
    return dateToCode + date_count;
  } catch (error) {
    console.log(error);
  }
};
