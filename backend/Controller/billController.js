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
const generateStatementPdfUrl = require("../Utility/generateStatementPdfUrl");

exports.createBill = catchAsyncError(async (req, res, next) => {
  if (req.body._id) {
    const bill = await Bill.findById({ _id: req.body._id });
    if (!bill) {
      return next(new ErrorHandler(404, "user not found"));
    }
    console.log("find th bill", req.body._id);
    updateAmount(
      bill?.amount,
      req?.body?.amount,
      req?.body?.customerId,
      req?.body?.payment
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

  const totalAmount = totalBills.reduce((amount, bill) => {
    console.log(bill);
    return (amount = amount + (bill.amount || 0));
  }, 0);
  console.log("TotalAmount", totalAmount);
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
    totalAmount: totalAmount,
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
  const bill = await Bill.findById(req.body.id);
  if (!bill) {
    return next(new ErrorHandler(404, "bill not found"));
  }

  await removePayment(bill.customerId, bill.amount, bill.payment);

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

exports.getStatements = catchAsyncError(async (req, res, next) => {
  const { startDate, endDate } = req.body;
  const { partyId } = req.query;
  if (!startDate || !endDate) {
    return next(new ErrorHandler(200, "start date or end date missing."));
  }
  let sDate = new Date(startDate);
  sDate = sDate.setHours(0, 0, 0, 0);
  let eDate = new Date(endDate);
  eDate = eDate.setHours(23, 59, 59, 999);
  let filter = {};
  if (partyId) {
    filter = {
      date: {
        $gte: new Date(sDate),
        $lte: new Date(eDate),
      },
      customerId: partyId,
    };
  } else {
    filter = {
      date: {
        $gte: new Date(sDate),
        $lte: new Date(eDate),
      },
    };
  }
  const allBills = await Bill.find(filter).sort({ date: 1 });
  return res.status(200).json({
    success: true,
    bills: allBills,
  });
});

exports.generateStatementPdf = catchAsyncError(async (req, res, next) => {
  const { startDate, endDate } = req.body;
  const { partyId } = req.query;
  if (!startDate || !endDate) {
    return next(new ErrorHandler(200, "start date or end date not found."));
  }
  const token = req.cookies.token;
  if (token === "j:null") {
    return next(new ErrorHandler(401, "Login Required"));
  }
  const userInfo = decryptToken(token);
  let sDate = new Date(startDate);
  sDate = sDate.setHours(0, 0, 0, 0);
  let eDate = new Date(endDate);
  eDate = eDate.setHours(23, 59, 59, 999);
  const user = await User.findById(userInfo.id);
  let filter = {};
  if (partyId) {
    filter = {
      date: {
        $gte: new Date(sDate),
        $lte: new Date(eDate),
      },
      customerId: partyId,
    };
  } else {
    filter = {
      date: {
        $gte: new Date(sDate),
        $lte: new Date(eDate),
      },
    };
  }
  const allBills = await Bill.find(filter).sort({ date: 1 });
  const url = await generateStatementPdfUrl(allBills, user, startDate, endDate);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline; filename=generated.pdf");

  res.send(url);
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
  const bill = await Bill.findById({ _id: req.query.id });
  if (!bill) {
    return next(new ErrorHandler(404, "Bill data not found"));
  }
  const url = await generatePdf(bill, user);
  res.setHeader("Content-Type", "application/pdf");
  res.send(url);
});
