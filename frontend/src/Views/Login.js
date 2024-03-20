import { useForm, SubmitHandler } from "react-hook-form";
import InputField from "../Components/InputField";
import AppButton from "../Components/AppButton";
import { COLORS } from "../assets/colors";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { makeRequest } from "../service/apiconfig";
import Layout from "./Layout";
import Heading from "../Components/Heading";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const form = useForm();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState } = form;
  const { errors } = formState;

  const onSumbmit = (val) => {
    const data = {
      username: val.username,
      password: val.password,
    };
    const url = "/login";
    makeRequest(url, "POST", data, loginCallBack);
  };

  const loginCallBack = (response) => {
    if (response?.success) {
      toast.success("Login Success.");
      navigate("/");
    } else {
      toast.error("Wrong Username or Password.");
    }
  };

  return (
    <Layout>
      <div className="relative w-full flex flex-col items-center">
        <form className="w-full md:w-1/2 flex flex-col gap-12 md:gap-18 mt-10 md:mt-20">
          <Heading title={"Welcome back!"} />
          <InputField
            label={"Username"}
            placeholder={"Enter username"}
            register={register("username", {
              required: "Username is required",
            })}
            errorMessage={errors?.username?.message}
            id={"username"}
            error={errors.username}
          />
          <InputField
            label={"Password"}
            placeholder={"Enter your password"}
            id={"password"}
            type={"password"}
            error={errors.password}
            errorMessage={errors?.password?.message}
            register={register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long.",
              },
            })}
          />
          <Link to="/user/password/forgot" className="ml-auto">
            <p className="text-base ml-auto transition-all hover:font-bold border-slate cursor-pointer font-medium text-slate">
              Forgot Password
            </p>
          </Link>
          <AppButton
            label="Login"
            onPress={handleSubmit(onSumbmit)}
            className=""
          />
        </form>
      </div>
    </Layout>
  );
};
export default Login;
