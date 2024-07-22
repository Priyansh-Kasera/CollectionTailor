const mongoose = require("mongoose");
const Bill = require("../Models/billModel");

const party = new mongoose.Schema({
  partyName: {
    type: String,
    required: [true, "Party name is required"],
  },
  mobileNo: {
    type: Number,
    required: [true, "Party Number is required"],
  },
  amount: {
    type: Number,
    default: 0,
  },
  openingBalance: {
    type: Number,
    default: 0,
  },
  address: {
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    pinCode: {
      type: String,
      length: [6, "Wrong pin code format"],
    },
  },
});

party.post("findOneAndDelete", async function (party) {
  console.log("party", party);
  if (party._id) {
    await Bill.deleteMany({ customerId: party._id });
  }
});

module.exports = mongoose.model("party", party);
