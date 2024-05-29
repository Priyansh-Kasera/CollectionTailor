import { useState } from "react";
import { cn } from "../Utility/helper";
import { COLORS } from "../assets/colors";
import { useEffect } from "react";
import { makeRequest } from "../service/apiconfig";
import { useRef } from "react";
import { useForm } from "react-hook-form";

const DropDown = ({
  label,
  required,
  id,
  type,
  error,
  errorMessage,
  placeholder,
  register,
  watch,
  setValue,
  partyId,
}) => {
  const [inputText, setInputText] = useState("");
  const [searchedParty, setSearchedParty] = useState([]);
  const [showDropDown, setShowDropDown] = useState(false);
  const inputRef = useRef();
  useEffect(() => {
    const handleEscKeyPress = (ev) => {
      if (ev.key === "Escape") {
        setShowDropDown(false);
      }
    };
    const handleMouseClick = (ev) => {
      const area = document.getElementById("dropdown");
      if (area && area.contains(ev.target)) {
        ev.preventDefault();
        return;
      }
      setShowDropDown(false);
    };
    document.addEventListener("keydown", handleEscKeyPress);
    document.addEventListener("mousedown", handleMouseClick);
    return () => {
      document.removeEventListener("keydown", handleEscKeyPress);
      document.removeEventListener("mousedown", handleMouseClick);
    };
  }, []);
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === "partyName") {
        makeRequest(
          `/party/search`,
          "POST",
          { query: value.partyName },
          searchedPartyCB,
          true
        );
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const searchedPartyCB = (res) => {
    // setShowDropDown(true);
    setSearchedParty(res.data);
  };

  return (
    <div className="relative w-full flex flex-col gap-1">
      {label ? (
        <label
          className="font-semibold text-base"
          style={{ color: COLORS.darkText }}
          htmlFor={id}
        >
          {label} {required ? <span className="text-red-500">*</span> : null}
        </label>
      ) : null}
      <input
        autoComplete="off"
        onFocus={() => {
          setShowDropDown(true);
        }}
        id={id}
        ref={inputRef}
        className={cn(
          " py-2 focus:outline-none bg-transparent border-b  hover:placeholder:text-gray-600 focus:placeholder:text-gray-600",
          error ? "border-red-500" : "border-black"
        )}
        placeholder={placeholder || "Enter value"}
        {...register}
      />
      {error ? (
        <p className="text-red-500 font-medium">{errorMessage}</p>
      ) : null}
      {showDropDown ? (
        <div
          id="dropdown"
          className="absolute w-full p-2 top-full mt-2 z-10 flex flex-col gap-1 rounded-lg max-h-60 overflow-scroll"
          style={{ backgroundColor: COLORS.cardBg, scrollbarWidth: "none" }}
        >
          {searchedParty.length ? (
            searchedParty.map((party, index) => {
              const selectPartyName = () => {
                setValue("partyName", party.partyName);
                setValue("partyId", party._id);
                setShowDropDown(false);
              };
              return (
                <p
                  className={`p-2 rounded-md cursor-pointer hover:bg-[#f3f4e9]`}
                  key={index}
                  onClick={selectPartyName}
                >
                  {party.partyName}
                </p>
              );
            })
          ) : (
            <p className="p-4 rounded-md text-center font-medium ">
              No data found
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
};
export default DropDown;
