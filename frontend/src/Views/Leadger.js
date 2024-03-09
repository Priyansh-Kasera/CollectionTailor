import { useEffect, useState } from "react";
import PartySearchBar from "../Components/PartySearchBar";
import DateInput from "../Components/DateInput";
import Card from "../Components/Card";
import Pagination from "../Components/Pagination";
import Layout from "./Layout";
import moment from "moment";
import {
  createLeadgerPdf,
  createPdfRequest,
  makeRequest,
} from "../service/apiconfig";
import { toast } from "react-toastify";
import { cn } from "../Utility/helper";
import EmptyList from "../Components/EmptyList";
import AppButton from "../Components/AppButton";
import { Link } from "react-router-dom";

const Leadger = () => {
  const [partyData, setPartyData] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [leadgerData, setLeadgerData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalNumberOfLeadger, setTotalNumberOfLeadger] = useState(10);

  useEffect(() => {
    const date = new Date();
    date.setDate(startDate.getDay() - 30);
    setStartDate(date);
  }, []);

  useEffect(() => {
    console.log("in this");
    if (partyData) {
      const data = {
        startDate,
        endDate,
        partyId: partyData._id,
        partyName: partyData.partyName,
        page,
      };
      makeRequest("/party/ledger", "POST", data, getPartyLedgerCB);
    }
  }, [startDate, endDate, partyData, page]);

  const getPartyLedgerCB = (res) => {
    if (res.success) {
      setLeadgerData(res?.data?.bills);
      setTotalNumberOfLeadger(
        Math.ceil(res?.data?.totalBills / res?.data?.paginationCount)
      );
    } else {
      toast.error("Can't fetch current party leadgr.");
    }
  };
  const getLedgerData = (partyData) => {
    setPartyData(partyData);
    setPage(1);
  };

  const setStartDateFun = (date) => {
    setPage(1);
    setStartDate(date);
  };

  const setEndDateFun = (date) => {
    setPage(1);
    setEndDate(date);
  };

  const downloadLeadger = () => {
    const data = {
      startDate,
      endDate,
      partyId: partyData._id,
    };
    createLeadgerPdf("/party/ledgerPdf", "POST", data, generatePdfCB);
  };
  const generatePdfCB = (res) => {
    console.log(res, "result");
    const url = URL.createObjectURL(res);
    const aElement = document.createElement("a");
    aElement.href = url;
    aElement.download = `ledger_${partyData._id}.pdf`;
    document.body.appendChild(aElement);
    aElement.click();
    document.body.removeChild(aElement);
    URL.revokeObjectURL(url);
  };
  return (
    <Layout>
      <PartySearchBar onPartySelect={getLedgerData} />
      <div className="w-full flex flex-row justify-between mt-4 md:mt-10">
        <DateInput
          value={moment(startDate).format("YYYY-MM-DD")}
          onChange={setStartDateFun}
        />

        <DateInput
          value={moment(endDate).format("YYYY-MM-DD")}
          onChange={setEndDateFun}
        />
      </div>
      <div className="flex flex-col gap-2 md:gap-4 min-h-80 mt-8">
        {leadgerData.length ? (
          leadgerData.map((tran, index) => {
            const getFinalAmount = () => {
              if (tran.payment) {
                return tran.lastBalance - tran.amount;
              } else {
                return tran.lastBalance + tran.amount;
              }
            };
            return (
              <Card key={index} to={tran.payment ? "" : `/bill/${tran._id}`}>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row justify-between">
                    <h1 className="text-primary">{tran.customerName}</h1>
                    <h1 className="text-normal">
                      {moment(tran.date).format("DD/MM/YYYY")}
                    </h1>
                  </div>
                  <div className="flex flex-row justify-between">
                    <h1 className="text-normal">
                      {tran.invoiceNo === -1
                        ? "Payment"
                        : `Challan No: ${tran.challanNo}`}
                    </h1>
                    <h1 className="text-normal">
                      {tran.invoiceNo === -1
                        ? ""
                        : `Invoice No: ${tran.invoiceNo}`}
                    </h1>
                  </div>
                  <div className="flex flex-row justify-between">
                    <h1
                      className={cn(
                        "text-normal",
                        tran.payment ? "text-green-500" : "text-red-500"
                      )}
                    >
                      Amount: {tran.amount} {tran.payment ? "DR" : "CR"}
                    </h1>

                    <h1
                      className={cn(
                        "text-normal",
                        getFinalAmount() > 0 ? "text-red-500" : "text-green-500"
                      )}
                    >
                      Last Due: {Math.abs(getFinalAmount())}
                    </h1>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <EmptyList label="bills" buttonLabel="Create bill" />
        )}
      </div>
      {leadgerData.length ? (
        <div className="mt-10">
          <AppButton label="Download Leadger" onPress={downloadLeadger} />
        </div>
      ) : null}
      <Pagination
        noOfPage={totalNumberOfLeadger}
        page={page}
        setPage={setPage}
      />
    </Layout>
  );
};
export default Leadger;
