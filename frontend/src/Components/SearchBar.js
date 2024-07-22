import { CiSearch } from "react-icons/ci";
import { COLORS } from "../assets/colors";
import { RxCross2 } from "react-icons/rx";
const SearchBar = ({
  placeholder,
  onTextChage,
  type = "text",
  onFocus,
  value,
  removeText,
}) => {
  const handleTextChange = (ev) => {
    const value = ev.target.value;
    onTextChage(value);
  };
  const handleRemoveText = () => {
    removeText && removeText();
  };
  return (
    <div className="w-full flex justify-center">
      <div
        className="w-full relative flex flex-row items-center border-2 border-black rounded-md p-1 md:p-2 text-xs md:text-base"
        style={{ borderColor: COLORS.slate }}
      >
        <div className="flex-1">
          <input
            onChange={handleTextChange}
            onFocus={onFocus}
            type={type}
            value={value}
            className="w-full bg-transparent placeholder:text-gray-600 focus:outline-none  focus:placeholder:text-gray-800"
            placeholder={placeholder || "Enter text"}
          />
        </div>
        <div className="flex justify-center items-center">
          {value ? (
            <RxCross2
              className="text-xl md:text-2xl"
              color={COLORS.slate}
              onClick={handleRemoveText}
            />
          ) : (
            <CiSearch className="text-xl md:text-2xl" color={COLORS.slate} />
          )}
        </div>
      </div>
    </div>
  );
};
export default SearchBar;
