import { cn } from "../Utility/helper";

const MaxWidthWrapper = ({ children, className }) => {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-screen-xl px-2.5 md:px-20 relative",
        className
      )}
    >
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
