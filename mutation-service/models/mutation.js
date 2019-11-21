const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const utils = require("../utils/mutationUtils");

const mutationSchema = new Schema(
  {
    code: {
      type: String,
      required: true
    },
    date: {
      type: String
    },
    recipient: {
      type: String,
      required: true
    },
    amount: {
      type: String,
      required: true
    },
    user: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

//Using middleware to generate expected result for the respected field
mutationSchema.pre("save", async function(next) {
  const mutation = this;

  //Now date
  const date = new Date();

  let date_count;

  //Count document on this date for the corresponding user
  const countDocument = await mutation.constructor.aggregate([
    {
      $project: {
        createdAt: {
          $dateFromString: {
            dateString: date.toDateString()
          }
        },
        user: 1
      }
    },
    {
      $match: {
        user: mutation.user
      }
    },
    {
      $count: "date_count"
    }
  ]);

  //Check if the day has no transaction
  if (countDocument.length === 0) {
    //Using padstart to fill 0 in front of number
    //first transaction of the day
    //"" + number was to convert number to string
    date_count = ("" + 1).padStart(3, "0");
  } else {
    //every next transaction
    date_count = ("" + (countDocument[0].date_count + 1)).padStart(3, "0");
  }

  //Make date without separation for expected format
  const dateToCode =
    date.getDate() +
    "" +
    (date.getMonth() + 1) +
    "" +
    //slice string to get 2 last digit from the year
    date
      .getFullYear()
      .toString()
      .slice(2, 4);

  const code = mutation.code + dateToCode + date_count;

  mutation.amount = utils.amountFormatter(mutation.code, mutation.amount);
  mutation.code = code;
  mutation.date = date.toLocaleDateString() + " " + date.toLocaleTimeString();
  next();
});

mutationSchema.methods.toJSON = () => {
  const mutation = this;

  const mutationObject = mutation.toObject();
  delete mutationObject.createdAt;
  delete mutationObject.updatedAt;
  delete mutationObject._id;

  return mutationObject;
};

const mutation = mongoose.model("Mutation", mutationSchema);

module.exports = mutation;
