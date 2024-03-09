import { useForm } from "react-hook-form";
import Layout from "./Layout";
import InputField from "../Components/InputField";
import DropDown from "../Components/DropDown";
import AppButton from "../Components/AppButton";
import { useRef } from "react";
import { makeRequest } from "../service/apiconfig";
import { toast } from "react-toastify";
import Heading from "../Components/Heading";

const Payment = () => {
  const form = useForm();
  const { register, handleSubmit, formState, watch, setValue } = form;
  const { errors } = formState;
  const makePayment = (value) => {
    const { partyName, partyId, amount, invoiceNumber } = value;
    const data = {
      payment: true,
      amount: amount,
      invoiceNo: invoiceNumber || -1,
      customerName: partyName,
      customerId: partyId,
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
  return (
    <Layout>
      <div className="w-full relative flex flex-col items-center">
        <form className="w-full md:w-1/2 flex flex-col gap-12 md:gap-18 mt-10 md:mt-20">
          <Heading title={"Collect Payment"} />
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
