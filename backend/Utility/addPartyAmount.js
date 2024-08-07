const Party = require("../Models/partyModel");

exports.addAmount = async (billAmount, partyId, status, isPayment) => {
  const party = await Party.findById({ _id: partyId });
  if (party) {
    let amount = party?.amount;
    if (isPayment) {
      amount -= billAmount;
    } else {
      amount += billAmount;
    }
    party.amount = amount;
    updatedParty = await Party?.findByIdAndUpdate({ _id: partyId }, party);
  }
};

exports.removePayment = async (partyId, billAmtDel, isPayment) => {
  const party = await Party.findById({ _id: partyId });
  if (party) {
    let amount = party?.amount;
    if (isPayment) {
      amount += billAmtDel;
    } else {
      amount -= billAmtDel;
    }
    party.amount = amount;
    updatedParty = await Party?.findByIdAndUpdate({ _id: partyId }, party);
  }
};

exports.updateAmount = async (oldAmount, newAmount, partyId, isPayment) => {
  const party = await Party.findById({ _id: partyId });
  if (party) {
    let amount = party?.amount;

    let sum = 0;
    if (isPayment) {
      sum += oldAmount;
      sum -= newAmount;
    } else {
      sum -= oldAmount;
      sum += newAmount;
    }

    amount += sum;

    party.amount = amount;
    await Party.findByIdAndUpdate({ _id: partyId }, party);
  }
};
