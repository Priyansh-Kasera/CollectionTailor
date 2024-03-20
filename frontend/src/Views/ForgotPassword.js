import { useForm } from "react-hook-form";
import AppButton from "../Components/AppButton";
import Heading from "../Components/Heading";
import InputField from "../Components/InputField";
import { makeRequest } from "../service/apiconfig";
import { toast } from "react-toastify";
import { useState } from "react";

const { default: Layout } = require("./Layout");

const ForgotPassword = () => {
  const form = useForm();
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;
  const [emailSend, setEmailSend] = useState(false);

  const onSubmit = (data) => {
    setEmailSend(false);
    makeRequest("/password/forgot", "POST", data, sendEmailCB);
  };

  const sendEmailCB = (res) => {
    if (res.success) {
      toast.success(res.message);
      setEmailSend(true);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <Layout check={false}>
      <div className="w-full flex flex-col items-center">
        <form className="w-full md:w-3/4 flex flex-col gap-12 md:gap-18 mt-10 md:mt-20">
          <Heading title={"Forgot Password"} />
          <InputField
            label={"Email"}
            placeholder={"Enter your email address"}
            register={register("email", {
              required: "Enter email address.",
              pattern: {
                value: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,
                message: "Enter valid email address.",
              },
            })}
            error={errors.email}
            errorMessage={errors.email?.message}
          />
          {emailSend && (
            <p className="text-green-600 text-sm lg:text-lg font-medium italic">
              Email successfully sent to your email please check your inbox.
            </p>
          )}
          <div className="mt-15" />
          <AppButton onPress={handleSubmit(onSubmit)}>Send Code</AppButton>
        </form>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
