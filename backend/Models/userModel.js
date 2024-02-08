const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const user = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, "Username already exist."],
    required: [true, "enter Username"],
  },
  email: {
    type: String,
    required: [true, "enter email"],
    unique: [true, "Email already exist."],
  },
  mobileNumber: {
    type: Number,
    required: [true, "Enter mobile Number"],
    length: [10, "Mobile number must be 10 digit long"],
  },
  name: {
    type: String,
    required: [true, "enter Name"],
  },
  password: {
    type: String,
    required: [true, "enter Password"],
  },
  bankDetail: [
    {
      bankName: {
        type: String,
        required: [true, "enter bank name"],
      },
      accountNumber: {
        type: String,
        required: [true, "enter accountNumber"],
      },
      ifscCode: {
        type: String,
        required: [true, "enter ifsc code"],
      },
    },
  ],
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});
user.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  console.log("hashing password", this.password);
  this.password = await bcryptjs.hash(this.password, 10);
});
user.methods.comparePassword = async function (password) {
  return bcryptjs.compare(password, this.password);
};
user.methods.getJwtToken = async function () {
  return jwt.sign(
    { id: this._id, username: this.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

user.methods.getResetPasswordToken = async function () {
  console.log("In function");
  // generationg Token
  const resetToken = crypto.randomBytes(20).toString("hex");
  // hashing and adding to reset password
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("user", user);
