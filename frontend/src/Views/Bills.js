import { useEffect, useState } from "react";
import Layout from "./Layout";
import { makeRequest } from "../service/apiconfig";
import { toast } from "react-toastify";
import SearchBar from "../Components/SearchBar";
import Card from "../Components/Card";
import EmptyList from "../Components/EmptyList";
import moment from "moment";
import { COLORS } from "../assets/colors";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import Pagination from "../Components/Pagination";
import DateInput from "../Components/DateInput";
import { useNavigate } from "react-router-dom";

const Bills = () => {
  const [page, setPage] = useState(1);
  const [allBills, setAllBills] = useState([]);
  const [searchedText, setSearchedText] = useState("");
  const [date, setDate] = useState("");
  const [totalNumberOfPages, setTotalNumberOfPages] = useState(10);
  const navigate = useNavigate();

  const fetchData = () => {
    makeRequest(
      `/bill/showAll?page=${page}&keyword=${searchedText}&date=${date}`,
      "GET",
      null,
      getAllBillsCB
    );
  };
  useEffect(() => {
    fetchData();
  }, [page, searchedText, date]);

  const getAllBillsCB = (res) => {
    if (res.success) {
      setAllBills(res.bills);
      const noOfPage = Math.ceil(res.totalBills / res.paginationCount);
      setTotalNumberOfPages(noOfPage);
    } else toast.error("Can't load bills.");
  };

  const handleSearch = (text) => {
    setPage(1);
    setSearchedText(text);
  };

  const handleDateChange = (date) => {
    setPage(1);
    setDate(String(date));
  };

  const deleteBillCB = (res) => {
    if (res.success) {
      toast.success("Bill deleted successfully.");
      fetchData();
    } else {
      toast.error("Can't delete the bill, try after sometime.");
    }
  };

  return (
    <Layout>
      <div className="flex flex-1 flex-col md:flex-row gap-6">
        <SearchBar onTextChage={handleSearch} />
        <DateInput value={date} onChange={handleDateChange} />
      </div>
      <div className="flex flex-col gap-4 mt-12 min-h-96">
        {allBills.length ? (
          allBills.map((bill, index) => {
            const editBill = (event) => {
              navigate(`update/${bill._id}`);
              event.preventDefault();
            };

            const deleteBill = (event) => {
              const data = {
                id: bill._id,
              };
              makeRequest("/bill/delete", "POST", data, deleteBillCB);
              event.preventDefault();
            };

            return (
              <Card to={bill._id} key={index}>
                <div className="w-full relative flex flex-col">
                  <div className="flex flex-row md:flex-row justify-between items-center gap-2">
                    <h1 className="text-base md:text-2xl font-medium capitalize truncate flex-1">
                      {bill.customerName}
                    </h1>
                    <h1 className="text-normal">
                      Date: {moment(bill.date).format("DD/MM/YYYY")}
                    </h1>
                  </div>
                  <div className="flex flex-row justify-between mt-3">
                    <h1 className="text-normal">
                      Invoice No: {bill.invoiceNo}
                    </h1>
                    <h1 className="text-normal">
                      Challan Number: {bill.challanNo || 0}
                    </h1>
                  </div>
                  <div className="flex flex-row justify-between">
                    <h1 className="text-normal">
                      Number of items: {bill.items.length}
                    </h1>
                    <h1 className="text-normal">Amount: {bill.amount || 0}</h1>
                  </div>
                  <div className="flex flex-row gap-12 mt-5">
                    <h1
                      className="box-border uppercase text-sm lg:text-base text-red-500 font-medium border-b-2  border-background hover:border-red-500"
                      onClick={deleteBill}
                    >
                      Delete
                    </h1>
                    <h1
                      className="uppercase text-green-700 text-sm lg:text-base font-medium border-b-2  border-background hover:border-green-700"
                      onClick={editBill}
                    >
                      Edit
                    </h1>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <EmptyList buttonLabel="Create Bill" label="bills" />
        )}
      </div>
      <Pagination page={page} setPage={setPage} noOfPage={totalNumberOfPages} />
    </Layout>
  );
};

export default Bills;
