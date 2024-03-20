import { useForm } from "react-hook-form";
import Layout from "./Layout";
import { COLORS } from "../assets/colors";
import InputField from "../Components/InputField";
import AppButton from "../Components/AppButton";
import { makeRequest } from "../service/apiconfig";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import Heading from "../Components/Heading";
import { toast } from "react-toastify";

const CreateParty = () => {
  const form = useForm({
    defaultValues: {
      partyName: "",
      mobileNumber: "",
      openingAmount: "",
    },
  });
  const { id } = useParams();
  const { register, handleSubmit, formState, setValue } = form;
  const { errors } = formState;

  const onSubmit = (values) => {
    const { partyName, mobileNumber, openingAmount } = values;
    const data = {
      id: id || null,
      partyName,
      mobileNo: mobileNumber,
      address: null,
      amount: openingAmount || 0,
    };
    const url = "/party";

    makeRequest(url, "POST", data, createPartyCB);
  };
  useEffect(() => {
    if (id) {
      makeRequest(`/party/${id}`, "GET", null, getPartyDataCB);
    }
  }, []);

  const getPartyDataCB = (res) => {
    setValue("partyName", res?.data?.partyName || "");
    setValue("mobileNumber", res?.data?.mobileNo || "");
    setValue("openingAmount", res?.data?.amount);
  };
  const createPartyCB = (res) => {
    if (res.success) {
      toast.success(`Party ${id ? "updated" : "created"} successfully.`);
    } else {
      toast.error(res.message);
    }
  };
  return (
    <Layout>
      <div className="relative w-full flex flex-col items-center">
        <form className="w-full md:w-1/2 flex flex-col gap-12 md:gap-18 mt-10 md:mt-20">
          <Heading title={id ? "Update Party" : "Create Party"} />
          <InputField
            label={"Party Name"}
            placeholder={"Enter Party Name"}
            register={register("partyName", {
              required: "Party Name is required",
            })}
            errorMessage={errors?.partyName?.message}
            id={"partyName"}
            error={errors.partyName}
          />
          <InputField
            label={"Mobile Number"}
            placeholder={"Enter party Mobile Number"}
            id={"mobileNumber"}
            type={"number"}
            error={errors.mobileNumber}
            errorMessage={errors?.mobileNumber?.message}
            register={register("mobileNumber", {
              required: "Mobile number is required",
              minLength: {
                value: 10,
                message: "Enter a valid Phone number.",
              },
              maxLength: {
                value: 10,
                message: "Enter a valid Phone number.",
              },
              pattern: {
                value: /^[0]?[6789]\d{9}$/,
                message: "Enter a valid Phone number.",
              },
            })}
          />
          <InputField
            label={"Opening Amount (Optional)"}
            placeholder={"Enter Opening Amount"}
            id={"openingAmount"}
            type={"number"}
            error={errors.openingAmount}
            errorMessage={errors?.openingAmount?.message}
            register={register("openingAmount")}
          />

          <AppButton
            label={id ? "Update Party" : "Create Party"}
            onPress={handleSubmit(onSubmit)}
            className=""
          />
        </form>
      </div>
    </Layout>
  );
};
export default CreateParty;
