const User = require("../Models/userModel");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../Utility/errorhandler");
const sendToken = require("../Utility/jwtToken");
const sendEmail = require("../Utility/sendEmail");
const crypto = require("crypto");
const decryptToken = require("../Utility/decryptJwtToken");

exports.showAllUsers = (req, res) => {
  res.status(200).json({
    message: "route is working fine",
  });
};

exports.signUp = catchAsyncError(async (req, res, next) => {
  console.log(req.body);
  const user = await User.create(req.body);

  sendToken(user, 200, res);
});

exports.isLoggedIn = catchAsyncError(async (req, res, next) => {
  const token = req.cookies.token;
  if (token === "j:null") {
    return next(new ErrorHandler(401, "Login Required"));
  }

  const userInfo = decryptToken(token);

  const user = await User.findById(userInfo.id);
  const expDate = new Date(userInfo.exp * 1000);

  if (!user || Date.now() > expDate) {
    return next(new ErrorHandler(401, "Login Required"));
  }
  return res.status(200).json({
    success: true,
    id: userInfo.id,
    user: user,
  });
});

exports.login = catchAsyncError(async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    console.log("in this methos");
    return next(new ErrorHandler(401, "Enter username or password"));
  }
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    return next(new ErrorHandler(401, "username or password is wrong"));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler(401, "username or password is wrong"));
  } else {
    sendToken(user, 201, res);
  }
});

exports.updateUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById({ _id: req.body.id });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "user not found",
    });
  }
  const userUpdated = await User.findByIdAndUpdate(
    { _id: req.body.id },
    req.body,
    {
      new: true,
      runValidators: true,
      userFindAndModify: false,
    }
  );

  sendToken(userUpdated, 200, res);
});

exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expire: Date.now(),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "logged out sucessfully",
  });
});

exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) {
    return next(new ErrorHandler(400, "user not found"));
  }
  return res.status(200).json({
    success: true,
    user: user,
  });
});

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler(404, "user not found"));
  }
  const resetToken = await user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${req.protocol}://${res.get(
    "host"
  )}/reset/${resetToken}`;
  const message = `Your password reset token is ;- \n \n ${resetPasswordUrl} \n \n if you have not requested this email then,
    please ignore it `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Collection Tailor Password recovery",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email send to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(500, error.message));
  }
});

exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ErrorHandler(201, "User Not found to reset Password"));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler(201, "Password does not match"));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  console.log(user);
  await user.save();

  sendToken(user, 200, res);
});

exports.updatePassword = catchAsyncError(async (req, res, next) => {
  console.log(req.body);
  const user = await User.findById({ _id: req.body.id });
  if (!user) {
    return next(new ErrorHandler(400, "User Not found"));
  }
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler(400, "Old Password is incorrect"));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler(400, "password does not match"));
  }
  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 200, res);
});
