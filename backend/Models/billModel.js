const mongoose = require("mongoose");
const ErrorHandler = require("../Utility/errorhandler");

const Bill = new mongoose.Schema({
  invoiceNo: {
    type: Number,
  },
  customerName: {
    type: String,
    required: [true, "enter customer name"],
  },
  customerId: {
    type: String,
    required: [true, "enter party id"],
  },
  challanNo: {
    type: Number,
  },
  lrNo: {
    type: Number,
  },
  address: {
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    pincode: {
      type: Number,
    },
  },
  orderNo: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  throughBy: {
    type: String,
  },
  amount: {
    type: Number,
    required: [true, "amount is required"],
  },
  payment: {
    type: Boolean,
    default: false,
  },
  items: [
    {
      name: {
        type: String,
        required: [true, "enter bill items"],
      },
      price: {
        type: Number,
        required: [true, "enter item amount"],
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  status: {
    type: String,
    default: "GENERATED",
  },
});
Bill.pre("save", async function (next) {
  if (!this.invoiceNo) {
    // If invoiceNo is not provided, generate it
    const maxInvoice = await this.constructor
      .findOne({}, {}, { sort: { invoiceNo: -1 } })
      .exec();
    this.invoiceNo =
      maxInvoice && maxInvoice.invoiceNo ? maxInvoice.invoiceNo + 1 : 1;
  }
  if (!this.items.length && this.payment === false) {
    return next(new ErrorHandler(404, "items can't be null"));
  }

  next();
});

module.exports = mongoose.model("bill", Bill);
