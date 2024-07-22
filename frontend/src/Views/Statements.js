import React, { useLayoutEffect, useState } from "react";
import Layout from "./Layout";
import DateInput from "../Components/DateInput";
import { COLORS } from "../assets/colors";
import { createLeadgerPdf, makeRequest } from "../service/apiconfig";
import moment from "moment";
import PartySearchBar from "../Components/PartySearchBar";

const BillCard = ({ bill }) => (
  <div className="flex py-2">
    <p className="text-xs md:text-base text- font-semibold w-2/5 text-center">
      {bill.customerName}
    </p>
    <p className="text-xs md:text-base font-semibold w-1/5 text-center">
      {moment(bill.date).format("DD/MM/YYYY")}
    </p>
    <p className="text-xs md:text-base  font-semibold w-1/5 text-center">
      {bill.payment ? bill.amount || 0 : ""}
    </p>
    <p className="text-xs md:text-base font-semibold w-1/5 text-center">
      {bill.payment ? "" : bill.amount || 0}
    </p>
  </div>
);

const ListHeader = () => {
  return (
    <div className="flex mt-4 py-2" style={{ background: COLORS.cardBg }}>
      <p className="text-xs md:text-base text- font-semibold w-2/5 text-center">
        Party Name
      </p>
      <p className="text-xs md:text-base font-semibold w-1/5 text-center">
        Date
      </p>
      <p className="text-xs md:text-base  font-semibold w-1/5 text-center">
        CR
      </p>
      <p className="text-xs md:text-base font-semibold w-1/5 text-center">DR</p>
    </div>
  );
};

const ListFooter = ({ crAmount, drAmount }) => (
  <div className="flex border-t mt-2  border-black py-4">
    <p className="text-xs md:text-base text- font-bold w-3/5 text-center"></p>
    <p className="text-xs md:text-base  font-bold w-1/5 text-center">
      {crAmount}
    </p>
    <p className="text-xs md:text-base font-bold w-1/5 text-center">
      {drAmount}
    </p>
  </div>
);

const Statements = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedPartyId, setSelectedPartyId] = useState("");
  const [crAmount, setCrAmount] = useState(0);
  const [drAmount, setDrAmount] = useState(0);
  const [bills, setBills] = useState([]);

  useLayoutEffect(() => {
    const data = {
      startDate,
      endDate,
    };
    startDate &&
      endDate &&
      makeRequest(
        `/bill/getStatements?partyId=${selectedPartyId}`,
        "POST",
        data,
        getAllBillsCB
      );
  }, [startDate, endDate, selectedPartyId]);

  const getAllBillsCB = (res) => {
    const bills = res.bills || [];
    let crAmt = 0;
    let drAmt = 0;
    bills.map((bill) => {
      const amount = bill.amount || 0;
      if (bill.payment) {
        crAmt = crAmt + amount;
      } else {
        drAmt = drAmt + amount;
      }
    });
    setDrAmount(drAmt);
    setCrAmount(crAmt);
    setBills(res.bills);
  };

  const handleStartDateChange = (date) => {
    setStartDate(String(date));
  };

  const handleEndDateChange = (date) => {
    setEndDate(String(date));
  };
  const donwloadStatements = () => {
    const data = {
      startDate,
      endDate,
    };
    createLeadgerPdf(
      `/bill/statementPdf?partyId=${selectedPartyId}`,
      "POST",
      data,
      generatePdfCB
    );
  };

  const generatePdfCB = (res) => {
    const url = URL.createObjectURL(res);
    const aElement = document.createElement("a");
    aElement.href = url;
    aElement.download = `statement${moment(startDate).format(
      "DD-MM-YYYY"
    )}_${moment(endDate).format("DD-MM-YYYY")}.pdf`;
    document.body.appendChild(aElement);
    aElement.click();
    document.body.removeChild(aElement);
    URL.revokeObjectURL(url);
  };

  const handleSearch = (party) => {
    setSelectedPartyId(party._id);
  };
  return (
    <Layout>
      <PartySearchBar
        onPartySelect={handleSearch}
        removeParty={() => setSelectedPartyId("")}
      />
      <div className="flex justify-between mt-6">
        <div>
          <p className="mb-1 text-xs md:text-base">From date</p>
          <DateInput value={startDate} onChange={handleStartDateChange} />
        </div>
        <div>
          <p className="mb-1 w-full text-end text-xs md:text-base">To date</p>
          <DateInput value={endDate} onChange={handleEndDateChange} />
        </div>
      </div>
      <div className="flex justify-between p-2 mt-6">
        <p className="text-xs md:text-base font-bold">
          Total: {Math.abs(drAmount - crAmount)}
          {drAmount > crAmount ? "DR" : "CR"}
        </p>
        <p
          className="text-xs md:text-base font-bold text-slate cursor-pointer underline"
          onClick={donwloadStatements}
        >
          Download PDF
        </p>
      </div>

      <ListHeader />
      {bills.map((bill) => {
        return <BillCard bill={bill} />;
      })}
      <ListFooter crAmount={crAmount} drAmount={drAmount} />
    </Layout>
  );
};

export default Statements;
