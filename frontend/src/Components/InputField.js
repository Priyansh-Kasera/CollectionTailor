import { COLORS } from "../assets/colors";
import { cn } from "../Utility/helper";

const InputField = ({
  label,
  placeholder,
  register = {},
  className,
  id,
  error = false,
  type = "text",
  errorMessage = "",
  required = false,
}) => {
  return (
    <div className={cn(className, "relative w-full flex flex-col gap-1")}>
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
        id={id}
        type={type}
        {...register}
        className={cn(
          "w-full py-2 focus:outline-none bg-transparent border-b  hover:placeholder:text-gray-600 focus:placeholder:text-gray-600",
          error ? "border-red-500" : "border-black"
        )}
        placeholder={placeholder || "Enter value"}
      />
      {error ? (
        <p className="text-red-500 font-medium">{errorMessage}</p>
      ) : null}
    </div>
  );
};

export default InputField;
