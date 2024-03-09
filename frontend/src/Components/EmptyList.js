import emptyCartImage from "../Images/emptyCart.png";
import { cn } from "../Utility/helper";
const EmptyList = ({ label = "data", buttonLabel = "Add", className }) => {
  return (
    <div
      className={cn(
        className,
        "w-full flex flex-col justify-center items-center gap-2"
      )}
    >
      <div className="w-full h-96 flex justify-center items-center">
        <img src={emptyCartImage} className="bg-center bg-contain h-full" />
      </div>
      <h1 className="font-semibold text-lg md:text-xl">
        You don't have any {label} yet
      </h1>
      <p className="text-sm">
        Start creating resource by clicking on '{buttonLabel}'
      </p>
    </div>
  );
};
export default EmptyList;
