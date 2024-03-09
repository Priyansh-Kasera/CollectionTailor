import { COLORS } from "../assets/colors";

const DateInput = ({ value, onChange }) => {
  const handleDateChange = (ev) => {
    onChange(ev.target.value);
  };
  return (
    <div>
      <input
        type="date"
        className="bg-transparent border-2 p-1 md:p-2 rounded-md text-xs md:text-base font-medium outline-none"
        style={{ borderColor: COLORS.slate, color: COLORS.darkText }}
        onChange={handleDateChange}
        value={value}
      />
    </div>
  );
};
export default DateInput;
