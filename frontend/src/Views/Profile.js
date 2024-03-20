import { useForm } from "react-hook-form";
import Heading from "../Components/Heading";
import Layout from "./Layout";
import InputField from "../Components/InputField";
import { useEffect } from "react";
import { makeRequest } from "../service/apiconfig";
import { toast } from "react-toastify";
import { useState } from "react";
import AppButton from "../Components/AppButton";
import { Link } from "react-router-dom";

const Profile = () => {
  const [userInfo, setUser] = useState({});
  useEffect(() => {
    makeRequest("/me", "GET", null, getUserDetailCB);
  }, []);

  const getUserDetailCB = (result) => {
    if (result.success) {
      //   setValue(result.user);
      setUser(result.user);
    } else {
      toast.error(result.message);
    }
  };

  const updateUser = (data) => {
    makeRequest("/update", "PUT", data, updateUserCB);
  };

  const updateUserCB = (result) => {
    if (result.success) {
      toast.success("User update successfully.");
    } else {
      toast.error(result.message);
    }
  };
  const form = useForm({
    values: userInfo,
  });
  const { register, handleSubmit, control, formState, setValue } = form;
  const { errors } = formState;
  return (
    <Layout>
      <div className="relative flex flex-col gap-6 w-full items-center">
        <form className="w-full md:w-3/4 flex flex-col gap-12 md:gap-18 mt-10 md:mt-20">
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            <div className="flex flex-row items-end gap-4">
              <Heading title={"User Information"} />
              <Link to={`password/${userInfo._id}`}>
                <h1 className="text-slate font-semibold text-xs lg:text-lg border-b border-background hover:border-slate">
                  Change Password
                </h1>
              </Link>
            </div>
            <AppButton
              label="Save"
              onPress={handleSubmit(updateUser)}
              type="second"
            />
          </div>

          <InputField
            label={"UserName"}
            register={register("username", {
              required: "UserName is required.",
            })}
            error={errors.username}
            errorMessage={errors.username?.message}
          />
          <InputField
            label={"Email"}
            register={register("email", {
              required: "Email is required.",
              pattern: {
                value:
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: "Enter a valid email address.",
              },
            })}
            error={errors.email}
            errorMessage={errors.email?.message}
          />
          <InputField
            label={"Name"}
            register={register("name", {
              required: "Name is required.",
            })}
            error={errors.name}
            errorMessage={errors.name?.message}
          />
          <InputField
            label={"Mobile Number"}
            type="number"
            register={register("mobileNumber", {
              required: "Mobile number is required.",
              minLength: {
                value: 10,
                message: "Enter a valid mobile number.",
              },
              maxLength: {
                value: 10,
                message: "Enter a valid mobile number.",
              },
            })}
            error={errors.mobileNumber}
            errorMessage={errors.mobileNumber?.message}
          />
          <InputField
            label={"Bank Name"}
            register={register("bankDetail.[0].bankName", {
              required: "Bank name is required.",
            })}
            error={errors.bankDetail?.[0].bankName}
            errorMessage={errors.bankDetail?.[0]?.bankName?.message}
          />
          <InputField
            label={"Account Number"}
            type="number"
            register={register("bankDetail.[0].accountNumber", {
              required: "Account Number is requied.",
              pattern: {
                value: /^\d{9,18}$/,
                message: "Enter a valid account number.",
              },
            })}
            error={errors.bankDetail?.[0].accountNumber}
            errorMessage={errors.bankDetail?.[0]?.accountNumber?.message}
          />
          <InputField
            label={"IFSC Code"}
            register={register("bankDetail.[0].ifscCode", {
              required: "IFSC code is required.",
              pattern: {
                value: /^[A-Za-z]{4}\d{7}$/,
                message: "Enter a valid IFSC code.",
              },
            })}
            error={errors.bankDetail?.[0]?.ifscCode}
            errorMessage={errors.bankDetail?.[0]?.ifscCode?.message}
          />
        </form>
      </div>
    </Layout>
  );
};

export default Profile;
