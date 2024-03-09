import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "./Layout";
import InputField from "../Components/InputField";
import AppButton from "../Components/AppButton";
import DropDown from "../Components/DropDown";
import { COLORS } from "../assets/colors";
import { IoIosCloseCircle } from "react-icons/io";
import { makeRequest } from "../service/apiconfig";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import Heading from "../Components/Heading";

const CreateBill = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (id) {
      makeRequest(`/bill/find/${id}`, "GET", null, getBillCB);
    }
  }, []);
  const [defaultValues, setDefaultValues] = useState({
    partyName: "",
    partyId: null,
    challanNumber: null,
    lrNumber: null,
    orderNumber: null,
    throughBy: "",
    address: {
      city: "",
      state: "",
      pincode: null,
    },
    products: [
      {
        name: "",
        price: null,
        quantity: null,
      },
    ],
  });
  const getBillCB = (res) => {
    if (res?.success) {
      const bill = res.bill;
      setDefaultValues({
        partyName: bill.customerName,
        partyId: bill.customerId,
        challanNumber: bill.challanNo,
        lrNumber: bill.lrNo,
        orderNumber: bill.orderNo,
        throughBy: bill.throughBy,
        address: bill.address,
        products: bill.items,
      });
      console.log(defaultValues.current);
    } else {
      toast.error("Oops! something wrong happend.");
    }
  };
  const form = useForm({
    values: defaultValues,
  });
  const { register, setValue, watch, handleSubmit, formState, control } = form;
  const { errors } = formState;
  const { fields, append, remove } = useFieldArray({
    name: "products",
    control,
  });

  const findAmount = (products) => {
    return products.reduce(
      (sum, product) => sum + product.quantity * product.price,
      0
    );
  };

  const createBill = (value) => {
    const {
      partyName,
      partyId,
      challanNumber,
      lrNumber,
      address,
      orderNumber,
      throughBy,
      products,
    } = value;
    const data = {
      _id: id,
      customerName: partyName,
      customerId: partyId,
      challanNo: challanNumber,
      lrNo: lrNumber,
      address: address,
      orderNo: orderNumber,
      throughBy: throughBy,
      amount: findAmount(products),
      items: products,
    };
    makeRequest("/bill/create", "POST", data, createBillCB);
  };
  const createBillCB = (res) => {
    if (res.success) {
      toast.success("Bill Created");

      navigate(`/bill/${res.bill._id}`);
    } else {
      toast.error("Bill Creation Failed");
    }
  };
  return (
    <Layout>
      <div className="w-full flex flex-col relative items-center">
        <form className="w-full md:w-3/4 flex flex-col gap-12 md:gap-18 mt-10 md:mt-20">
          <Heading title={`${id ? "Update" : "Create"} Bill`} />
          <DropDown
            label={"Party Name"}
            required={true}
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
            label={"Challan Number"}
            required={true}
            placeholder={"Enter challan number"}
            id={"challanNumber"}
            register={register("challanNumber", {
              required: "Challan Number is required",
            })}
            error={errors.challanNumber}
            errorMessage={errors.challanNumber?.message}
            type="number"
          />

          <div className="w-full flex flex-row  gap-5">
            <div className="flex-1">
              <InputField
                label={"City"}
                placeholder={"City name"}
                id={"city"}
                register={register("address.city")}
              />
            </div>
            <div className="flex-1">
              <InputField
                label={"State"}
                placeholder={"State name"}
                id={"state"}
                register={register("address.state")}
              />
            </div>
            <div className="flex-1">
              <InputField
                label={"Pincode"}
                type="number"
                placeholder={"Enter pincode"}
                id={"pincode"}
                register={register("address.pincode")}
              />
            </div>
          </div>

          <InputField
            label={"Lr Number"}
            placeholder={"Enter lr number"}
            id={"lrNumber"}
            register={register("lrNumber")}
            type="number"
          />

          <InputField
            label={"Order Number"}
            placeholder={"Enter order number"}
            id={"orderNumber"}
            register={register("orderNumber")}
            type="number"
          />

          <InputField
            label={"Through by"}
            placeholder={"Enter name"}
            id={"throughBy"}
            register={register("throughBy")}
          />
          <div className="flex flex-col">
            <h1
              className="font-semibold text-base mb-3"
              style={{ color: COLORS.darkText }}
            >
              Products <span className="text-red-500">*</span>
            </h1>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-row justify-between gap-5 w-full flex-wrap mb-10 relative"
              >
                <div className="flex-1">
                  <InputField
                    placeholder={"Product Name"}
                    required={true}
                    id={`products.${index}.name`}
                    register={register(`products.${index}.name`, {
                      required: "required.",
                    })}
                    error={errors.products?.[index]?.name}
                    errorMessage={errors.products?.[index]?.name?.message}
                  />
                </div>
                <div className="flex-1">
                  <InputField
                    placeholder={"Quantity"}
                    required={true}
                    type="number"
                    id={`products.${index}.quantity`}
                    register={register(`products.${index}.quantity`, {
                      required: "required.",
                    })}
                    error={errors.products?.[index]?.quantity}
                    errorMessage={errors.products?.[index]?.quantity?.message}
                  />
                </div>
                <div className="flex-1">
                  <InputField
                    placeholder={"Price"}
                    required={true}
                    type="number"
                    id={`products.${index}.price`}
                    register={register(`products.${index}.price`, {
                      required: "required.",
                    })}
                    error={errors.products?.[index]?.price}
                    errorMessage={errors.products?.[index]?.price?.message}
                  />
                </div>
                {index > 0 ? (
                  <IoIosCloseCircle
                    className="absolute -top-2 -right-2 z-10"
                    color={COLORS.cardBg}
                    size={25}
                    onClick={() => {
                      remove(index);
                    }}
                  />
                ) : null}
              </div>
            ))}

            <AppButton
              label="Add"
              type="second"
              className="ml-auto mt-4"
              onPress={(e) => {
                e.preventDefault();
                append({ name: "", price: null, quantity: null });
              }}
            />
          </div>

          <AppButton
            label={`${id ? "Update" : "Create"} Bill`}
            onPress={handleSubmit(createBill)}
          />
        </form>
      </div>
    </Layout>
  );
};

export default CreateBill;
