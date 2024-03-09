import { useEffect } from "react";
import Layout from "./Layout";
import { createPdfRequest, makeRequest } from "../service/apiconfig";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import { COLORS } from "../assets/colors";
import AppButton from "../Components/AppButton";

const BillDetails = ({}) => {
  const { id } = useParams();
  const [billInfo, setBillInfo] = useState();
  useEffect(() => {
    makeRequest(`/bill/find/${id}`, "GET", null, getBillCB);
  }, []);

  const getBillCB = (res) => {
    if (res?.success) {
      setBillInfo(res.bill);
    } else {
      toast.error("Oops! Something wrong happend.");
    }
  };

  const generatePdf = () => {
    createPdfRequest(`/bill/generatePdf?id=${id}`, "GET", null, generatePdfCB);
  };
  const generatePdfCB = (res) => {
    const url = URL.createObjectURL(res);
    const aElement = document.createElement("a");
    aElement.href = url;
    aElement.download = `bill_${id}.pdf`;
    document.body.appendChild(aElement);
    aElement.click();
    document.body.removeChild(aElement);
    URL.revokeObjectURL(url);
  };
  function base64ToArrayBuffer(data) {
    var binaryString = window.atob(data);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
      var ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }
  return (
    <Layout>
      <div className="w-full relative flex flex-col gap-6 md:gap-12 items-center">
        <div className="flex flex-row justify-between items-center w-full">
          <div>
            <h1 className="text-xl md:text-3xl font-bold">
              {billInfo?.customerName}
            </h1>
            <p>
              {billInfo?.address.city} {billInfo?.address.state}{" "}
              {billInfo?.address.pincode}
            </p>
          </div>
          <Link to={`/bill/update/${billInfo?._id}`}>
            <AppButton type="type2" label="Edit" />
          </Link>
        </div>
        <div className="flex flex-col w-full">
          <div className="w-full flex flex-col md:flex-row justify-start md:justify-between">
            <h2 className="text-primary">
              Inovie Number: {billInfo?.invoiceNo}
            </h2>
            <h1 className="text-primary">
              Date Created: {moment(billInfo?.date).format("DD/MM/YYYY")}
            </h1>
          </div>
          <div className="w-full flex flex-col md:flex-row justify-start md:justify-between">
            <h2 className="text-primary">
              Challan Number: {billInfo?.challanNo}
            </h2>
            <h2 className="text-primary">Lr Number: {billInfo?.lrNo || 0}</h2>
          </div>
          <div className="w-full flex flex-col md:flex-row justify-start md:justify-between">
            <h2 className="text-primary">
              Order Number: {billInfo?.orderNo || 0}
            </h2>
            <h2 className="text-primary">
              Through By: {billInfo?.throughBy || "Not Provided"}
            </h2>
          </div>
        </div>

        <div className="w-full flex flex-col">
          <div
            className="flex flex-row p-2 mb-1"
            style={{ background: COLORS.cardBg }}
          >
            <p className="w-1/2 text-sm md:text-base font-semibold ">
              Item Name
            </p>
            <p className="w-1/4 text-sm md:text-base text-center font-semibold overflow-hidden">
              Quantity/meter
            </p>
            <p className="w-1/4 text-sm md:text-base text-center font-semibold">
              Price
            </p>
          </div>
          {billInfo?.items.map((item, index) => (
            <div
              key={index}
              className="flex flex-row p-2 mb-1"
              style={{ background: COLORS.imageBG }}
            >
              <p className="w-1/2 text-sm md:text-base font-semibold">
                {item.name}
              </p>
              <p className="w-1/4 text-sm md:text-base text-center font-semibold">
                {item.quantity}
              </p>
              <p className="w-1/4 text-sm md:text-base text-center font-semibold">
                {item.price}
              </p>
            </div>
          ))}
        </div>

        <h2 className="text-primary w-full">
          Total Amount: {billInfo?.amount}
        </h2>

        <AppButton label="Generate Pdf" onPress={generatePdf} />
      </div>
    </Layout>
  );
};
export default BillDetails;
