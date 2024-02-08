const Bills = require("../Models/billModel");

exports.findStartingBalance = async (req, resultPerPage) => {
  let startDate = new Date(req?.body?.startDate);
  let endDate = new Date(req?.body?.endDate);
  startDate = startDate.setHours(0, 0, 0, 0);
  endDate = endDate.setHours(23, 59, 59, 59);
  let billsBefore = await Bills.find({
    customerId: req?.body?.partyId,
    date: {
      $lt: new Date(startDate),
    },
  });
  let balance = 0;
  billsBefore?.map((bill) => {
    if (bill?.payment) {
      balance -= bill?.amount || 0;
    } else {
      balance += bill?.amount || 0;
    }
  });

  const currentPage = Number(req?.body?.page) || 1;
  if (currentPage !== 1) {
    const skip = resultPerPage * (currentPage - 1);
    let billsAfter = await Bills.find({
      customerId: req?.body?.partyId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }).limit(skip);
    billsAfter?.map((bill) => {
      if (bill?.payment) {
        balance -= bill?.amount || 0;
      } else {
        balance += bill?.amount || 0;
      }
    });
  }

  return balance;
};

exports.addCurrSum = async (startingBal, bills) => {
  const filteredBill = bills?.map((bill) => {
    const tempObj = { ...bill._doc, lastBalance: startingBal };
    if (bill?.payment) {
      startingBal -= bill?.amount || 0;
    } else {
      startingBal += bill?.amount || 0;
    }
    return tempObj;
  });
  return filteredBill;
};
