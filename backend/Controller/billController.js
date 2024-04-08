const Bill = require("../Models/billModel");
const User = require("../Models/userModel");
const ErrorHandler = require("../Utility/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeature = require("../Utility/apiFeature");
const generatePdf = require("../Utility/generatePdf");
const decryptToken = require("../Utility/decryptJwtToken");
const {
  addAmount,
  updateAmount,
  removePayment,
} = require("../Utility/addPartyAmount");
exports.createBill = catchAsyncError(async (req, res, next) => {
  if (req.body._id) {
    const bill = await Bill.findById({ _id: req.body._id });
    if (!bill) {
      return next(new ErrorHandler(404, "user not found"));
    }
    updateAmount(
      bill?.amount,
      req?.body?.amount,
      req?.body?.customerId,
      req?.body?.status
    );
    const updatedBill = await Bill.findByIdAndUpdate(req.body._id, req.body, {
      new: true,
      runValidators: true,
      userFindAndModify: false,
    });
    return res.status(200).json({
      success: true,
      bill: updatedBill,
    });
  }
  addAmount(
    req?.body?.amount,
    req?.body?.customerId,
    req?.body?.status,
    req?.body?.payment
  );
  const bill = await Bill.create(req.body);
  if (!bill) {
    return next(new ErrorHandler(404, "internal server error"));
  }
  return res.status(200).json({
    success: true,
    bill: bill,
  });
});

exports.getAllBill = catchAsyncError(async (req, res, next) => {
  const resultPerPage = process.env.PAGINATION_COUNT;
  const billCount = new ApiFeature(Bill.find(), req.query).search().filter();
  const totalBills = await billCount.query;
  const apiFeature = new ApiFeature(Bill.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const bills = await apiFeature.query;
  bills.sort((a, b) => a.invoiceNo - b.invoiceNo);
  return res.status(200).json({
    success: true,
    bills: bills,
    totalBills: totalBills.length,
    paginationCount: resultPerPage,
  });
});

exports.findBill = catchAsyncError(async (req, res, next) => {
  const bill = await Bill.findById(req.params.id);
  if (!bill) {
    return next(new ErrorHandler(404, "bill not found"));
  }
  return res.status(200).json({
    success: true,
    bill: bill,
  });
});

exports.deleteBill = catchAsyncError(async (req, res, next) => {
  console.log("id", req.body.id);
  const bill = await Bill.findById(req.body.id);
  if (!bill) {
    return next(new ErrorHandler(404, "bill not found"));
  }

  await removePayment(bill.customerId, bill.amount);

  await Bill.findByIdAndDelete(req.body.id);
  return res.status(200).json({
    success: true,
    message: "bill deleted successfully",
  });
});

exports.updateBill = catchAsyncError(async (req, res, next) => {
  const bill = await Bill.findById(req.params.id);
  if (!bill) {
    return next(new ErrorHandler(404, "bill not found"));
  }
  const updatedBill = await Bill.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    userFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    bill: updatedBill,
  });
});

exports.findBillByName = catchAsyncError(async (req, res, next) => {
  const customerName = req.body.customerName;
  const bills = await Bill.find({
    customerName: {
      $regex: customerName,
      $options: "i",
    },
  });
  res.status(200).json({
    success: true,
    data: bills,
  });
});

exports.findBillByDate = catchAsyncError(async (req, res, next) => {
  const targetDate = new Date(req.body.date);

  // Set the start and end of the target date
  const startDate = new Date(targetDate);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(targetDate);
  endDate.setHours(23, 59, 59, 999);

  const bills = await Bill.find({
    date: {
      $gte: startDate,
      $lt: endDate,
    },
  });
  console.log(bills.length);
  res.status(200).json({
    success: true,
    data: bills,
  });
});

exports.findBillByInvoice = catchAsyncError(async (req, res, next) => {
  const invoiceNo = req.params.number;
  const bill = await Bill.find({ invoiceNo });
  if (!bill.length) {
    return next(new ErrorHandler(404, "No bill found"));
  }
  res.status(200).json({
    success: true,
    data: bill,
  });
});

exports.chageBillStatus = catchAsyncError(async (req, res, next) => {
  const { status, id } = req.body;
  if (!status || !id) {
    return next(new ErrorHandler(404, "status or id of bill is missing"));
  }
  const bill = await Bill.findById(id);
  if (!bill) {
    return next(new ErrorHandler(404, "bill not found"));
  }

  const updatedBill = await Bill.findByIdAndUpdate(
    id,
    { status: status.toUpperCase() },
    {
      new: true,
      runValidators: true,
      userFindAndModify: false,
    }
  );
  res.status(200).json({
    success: true,
    data: updatedBill,
  });
});

exports.createPdf = catchAsyncError(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token || token === "j:null") {
    return next(new ErrorHandler(401, "Login Required"));
  }

  const userInfo = decryptToken(token);

  const user = await User.findById(userInfo.id);
  if (!user) {
    return next(new ErrorHandler(401, "User not found"));
  }
  console.log("bill id", req.query);
  const bill = await Bill.findById({ _id: req.query.id });
  if (!bill) {
    return next(new ErrorHandler(404, "Bill data not found"));
  }
  console.log("generating pdf", bill);
  const url = await generatePdf(bill, user);
  console.log("url", url);
  res.setHeader("Content-Type", "application/pdf");
  res.send(url);
});
