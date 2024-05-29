import { useForm } from "react-hook-form";
import Layout from "./Layout";
import InputField from "../Components/InputField";
import DropDown from "../Components/DropDown";
import AppButton from "../Components/AppButton";
import { useRef } from "react";
import { makeRequest } from "../service/apiconfig";
import { toast } from "react-toastify";
import Heading from "../Components/Heading";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import { useLayoutEffect } from "react";

const Payment = () => {
  const form = useForm({
    defaultValues: {
      partyName: "",
      partyId: "",
      amount: "",
      invoiceNumber: "",
      date: moment(new Date()).format("YYYY-MM-DD"),
    },
  });
  const { register, handleSubmit, formState, watch, setValue } = form;
  const { errors } = formState;
  const { id } = useParams();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (id) {
      makeRequest(`/bill/find/${id}`, "GET", null, getBillCB);
    }
  }, [id]);

  const getBillCB = (res) => {
    if (res?.success) {
      const bill = res.bill;
      setValue("partyName", bill.customerName);
      setValue("partyId", bill.customerId);
      setValue("amount", bill.amount);
      setValue("invoiceNo", bill.invoiceNo);
      setValue("date", moment(bill.date).format("YYYY-MM-DD"));
    } else {
      toast.error("Oops! something wrong happend.");
    }
  };

  const makePayment = (value) => {
    const { partyName, partyId, amount, invoiceNumber, date } = value;
    const data = {
      _id: id,
      payment: true,
      amount: amount,
      invoiceNo: invoiceNumber || -1,
      customerName: partyName,
      customerId: partyId,
      date: date,
    };
    makeRequest("/bill/create", "POST", data, makePaymentCB);
  };

  const makePaymentCB = (res) => {
    if (res.success) {
      toast.success("Payment successfull.");
    } else {
      toast.error("Can't make the payment something wrong happend.");
    }
  };

  const deleteBill = (event) => {
    const data = {
      id,
    };
    makeRequest("/bill/delete", "POST", data, deleteBillCB);
    event.preventDefault();
  };

  const deleteBillCB = (res) => {
    if (res.success) {
      toast.success("Payment deleted successfully.");
      navigate(`/ledger`);
    } else {
      toast.error("Can't delete the payment, try after sometime.");
    }
  };

  return (
    <Layout>
      <div className="w-full relative flex flex-col items-center">
        <form className="w-full md:w-1/2 flex flex-col gap-12 md:gap-18 mt-10 md:mt-20">
          <div className="flex justify-between items-end">
            <Heading title={id ? "Update Payment" : "Collect Payment"} />
            {id && (
              <h1
                className="uppercase text-sm lg:text-base text-red-500 font-medium border-b-2 cursor-pointer  border-background hover:border-red-500"
                onClick={deleteBill}
              >
                Delete Payment
              </h1>
            )}
          </div>
          <DropDown
            label={"Select Party"}
            placeholder={"Enter Party Name"}
            register={register("partyName", {
              required: "Party Name is requied",
            })}
            watch={watch}
            setValue={setValue}
            error={errors.partyName}
            errorMessage={errors.partyName?.message}
          />
          <InputField
            label={"Amount"}
            type="number"
            register={register("amount", {
              required: "Amount is required",
            })}
            placeholder={"Enter amount"}
            id="amount"
            error={errors.amount}
            errorMessage={errors.amount?.message}
          />
          <InputField
            label={"Date"}
            id={"date"}
            register={register("date", {
              required: "date is required",
            })}
            error={errors.date}
            errorMessage={errors.date?.message}
            type="date"
          />
          <InputField
            label={"Invoice No (Optional)"}
            type="number"
            register={register("invoiceNumber")}
            placeholder={"Enter invoice number"}
            id="invoice"
          />
          <AppButton label="Save" onPress={handleSubmit(makePayment)} />
        </form>
      </div>
    </Layout>
  );
};
export default Payment;
