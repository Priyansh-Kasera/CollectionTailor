import { useForm } from "react-hook-form";
import AppButton from "../Components/AppButton";
import Heading from "../Components/Heading";
import InputField from "../Components/InputField";
import Layout from "./Layout";
import { makeRequest } from "../service/apiconfig";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const form = useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const { register, handleSubmit, getValues, formState } = form;
  const { errors } = formState;

  const onSubmit = (values) => {
    const data = { ...values, id };
    makeRequest("/changePassword", "POST", data, chagePasswordCB);
  };

  const chagePasswordCB = (result) => {
    if (result.success) {
      toast.success("Password change successfully.");
      navigate("/");
    } else {
      toast.error("The password change attempt was unsuccessful.");
    }
  };
  return (
    <Layout>
      <div className="w-full flex flex-col relative items-center">
        <form className="w-full md:w-3/4 flex flex-col gap-12 md:gap-18 mt-10 md:mt-20">
          <Heading title={"Change Passwrod"} />
          <InputField
            label={"Old password"}
            type="password"
            register={register("oldPassword", {
              required: "Enter your old password.",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long.",
              },
            })}
            error={errors.oldPassword}
            errorMessage={errors.oldPassword?.message}
          />
          <InputField
            label={"New password"}
            type="password"
            register={register("newPassword", {
              required: "Enter your new password.",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long.",
              },
            })}
            error={errors.newPassword}
            errorMessage={errors.newPassword?.message}
          />
          <InputField
            label={"Confirm password"}
            type="password"
            register={register("confirmPassword", {
              required: "Enter password.",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long.",
              },
              validate: (match) => {
                const password = getValues("newPassword");
                return match === password || "Password should match!";
              },
            })}
            error={errors.confirmPassword}
            errorMessage={errors.confirmPassword?.message}
          />
          <AppButton label="Save" onPress={handleSubmit(onSubmit)} />
        </form>
      </div>
    </Layout>
  );
};
export default ChangePassword;
