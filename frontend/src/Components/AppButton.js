import { cn } from "../Utility/helper";
import { COLORS } from "../assets/colors";

const AppButton = ({
  label = "Submit",
  onPress = () => {},
  className = "",
  type = "first",
}) => {
  if (type === "first") {
    return (
      <button
        className={cn(
          className,
          "py-2 px-4 hover:translate-y-1 transition-all font-bold text-lg rounded-md w-full"
        )}
        style={{ backgroundColor: COLORS.cardBg, color: COLORS.darkText }}
        onClick={onPress}
      >
        {label}
      </button>
    );
  } else {
    return (
      <button
        className={cn(
          className,
          "py-1 px-6 hover:translate-y-1 transition-all font-medium md:text-base text-sm rounded-full w-min"
        )}
        style={{ color: COLORS.background, backgroundColor: COLORS.darkText }}
        onClick={onPress}
      >
        {label}
      </button>
    );
  }
};

export default AppButton;
