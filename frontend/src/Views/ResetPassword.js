import { useNavigate, useParams } from "react-router-dom";
import { makeRequest } from "../service/apiconfig";
import Layout from "./Layout";
import Heading from "../Components/Heading";
import InputField from "../Components/InputField";
import AppButton from "../Components/AppButton";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams();
  // useEffect(()=>{
  //     makeRequest(`/password/reset/${token}`,"PUT",null,resetPasswordCB)
  // },[])
  const form = useForm();
  const { register, handleSubmit, getValues, formState } = form;
  const { errors } = formState;
  const navigate = useNavigate();

  const onSubmit = (data) => {
    makeRequest(
      `/password/reset/${token}`,
      "PUT",
      data,
      resetPasswordCB,
      false
    );
  };

  const resetPasswordCB = (res) => {
    if (res.success) {
      toast.success("Password reset successfully.");
      navigate("/");
    } else {
      toast.error(res.message);
    }
  };
  return (
    <Layout check={false}>
      <div className="flex flex-col items-center w-full">
        <form className="w-full md:w-3/4 flex flex-col gap-12 md:gap-18 mt-10 md:mt-20">
          <Heading title={"Reset Password"} />
          <InputField
            label={"New Password"}
            placeholder={"Enter password"}
            type="password"
            register={register("password", {
              required: "Password is required.",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long.",
              },
            })}
            error={errors.password}
            errorMessage={errors.password?.message}
          />
          <InputField
            label={"Confirm Password"}
            placeholder={"Enter password"}
            type="password"
            register={register("confirmPassword", {
              required: "Confirm password is required.",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long.",
              },
              validate: (match) => {
                const password = getValues("password");
                return match === password || "Password should match!";
              },
            })}
            error={errors.confirmPassword}
            errorMessage={errors.confirmPassword?.message}
          />
          <AppButton onPress={handleSubmit(onSubmit)} label="Reset Password" />
        </form>
      </div>
    </Layout>
  );
};
export default ResetPassword;
