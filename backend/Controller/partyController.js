const Party = require("../Models/partyModel");
const Bill = require("../Models/billModel");
const User = require("../Models/userModel");
const ErrorHandler = require("../Utility/errorhandler");
const LedgerFeature = require("../Utility/ledgerFeature");
const catchAsyncError = require("../middleware/catchAsyncError");
const { json } = require("express");
const ApiFeature = require("../Utility/apiFeature");
const { findStartingBalance, addCurrSum } = require("../Utility/addCurrSum");
const generatePdf = require("../Utility/generatePdf");
const generateLedgerPdf = require("../Utility/generateLedgerPdf");
const decryptToken = require("../Utility/decryptJwtToken");

exports.getParties = catchAsyncError(async (req, res, next) => {
  console.log(req.query);
  const apiFeature = new LedgerFeature(Party.find(), req.query).search();
  const parties = await apiFeature.query;
  //console.log(parties, "Parties");
  res.status(200).json({
    success: true,
    data: parties,
  });
});

exports.findById = catchAsyncError(async (req, res, next) => {
  const party = await Party.findById(req.params.id);
  if (!party) {
    return next(new ErrorHandler(401, "Party not found"));
  }
  res.status(200).json({
    success: true,
    data: party,
  });
});

exports.addParty = catchAsyncError(async (req, res, next) => {
  const { partyName, mobileNo, address, id, amount, openingBalance } = req.body;
  const party = await Party.findById(id);
  if (party) {
    const updatedParty = await Party.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      userFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      data: updatedParty,
    });
  } else {
    const createdParty = await Party.create({
      partyName,
      mobileNo,
      address,
      amount,
      openingBalance,
    });
    res.status(200).json({
      success: true,
      data: createdParty,
    });
  }
});

exports.updateParty = catchAsyncError(async (req, res, next) => {
  const id = req.params.id;
  const party = await Party.findById(id);
  if (!party) {
    return next(new ErrorHandler(401, "Party not found"));
  }
  const updatedParty = await Party.findByIdAndUpdate(id, res.body, {
    new: true,
    runValidators: true,
    userFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    data: updatedParty,
  });
});

exports.deleteParty = catchAsyncError(async (req, res, next) => {
  const id = req.body.id;
  console.log("ID", req.body);
  const party = await Party.findByIdAndDelete(id);
  if (!party) {
    return next(new ErrorHandler(401, "Party not found"));
  }
  res.status(200).json({
    success: true,
    message: "Party deleted successfully.",
  });
});

exports.searchParty = catchAsyncError(async (req, res, next) => {
  const keyword = req.body.query
    ? {
        partyName: {
          $regex: req.body.query,
          $options: "i",
        },
      }
    : {};
  const filteredParty = await Party.find({ ...keyword });
  res.status(200).json({
    success: true,
    data: filteredParty,
  });
});

exports.getPartyLedger = catchAsyncError(async (req, res, next) => {
  const { partyId, partyName, startDate, endDate } = req.body;
  const resultPerPage = process.env.PAGINATION_COUNT;
  const totalBillsQuery = new LedgerFeature(Bill.find(), req.body)
    .fetchPartyBill()
    .filterByDate();
  const billsCount = await totalBillsQuery.query;
  const partyBillsObject = new LedgerFeature(Bill.find(), req.body)
    .fetchPartyBill()
    .filterByDate()
    .pagination(resultPerPage);
  const startingAmt = await findStartingBalance(req, resultPerPage);
  const fetchAllBills = await partyBillsObject.query;
  fetchAllBills.sort((a, b) => a.date - b.date);
  console.log("starting amount", startingAmt);
  filteredBills = await addCurrSum(startingAmt, fetchAllBills);
  const data = {
    bills: filteredBills,
    totalBills: billsCount.length,
    paginationCount: resultPerPage,
  };
  return res.status(200).json({
    success: true,
    data: data,
  });
});

exports.downloadLedgerPdf = catchAsyncError(async (req, res, next) => {
  console.log(req.body);
  const { bills, startDate, endDate, partyId } = req.body;
  const token = req.cookies.token;

  if (token === "j:null") {
    return next(new ErrorHandler(401, "Login Required"));
  }
  const userInfo = decryptToken(token);

  const user = await User.findById(userInfo.id);
  if (!user) {
    return next(new ErrorHandler(401, "User not found"));
  }
  console.log("Party id", partyId);
  const party = await Party.findById({ _id: partyId });
  console.log(!party, "partyFound");
  if (!party) {
    return next(new ErrorHandler(404, "Party Not found"));
  }
  const totalBillsQuery = new LedgerFeature(Bill.find(), req.body)
    .fetchPartyBill()
    .filterByDate();
  const allBills = await totalBillsQuery.query;
  const startingAmt = await findStartingBalance(req);
  filteredBills = await addCurrSum(startingAmt, allBills);

  const url = await generateLedgerPdf(
    user,
    filteredBills,
    party,
    startDate,
    endDate
  );

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline; filename=generated.pdf");

  res.send(url);
});
