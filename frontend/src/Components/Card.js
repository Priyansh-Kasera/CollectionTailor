import { COLORS } from "../assets/colors";
import { Link } from "react-router-dom";

const Card = ({ children, to }) => {
  return (
    <Link to={to}>
      <div
        className="w-full rounded-md border-2 hover:translate-y-1 transition-all p-2 md:p-4"
        style={{ borderColor: COLORS.slate }}
      >
        {children}
      </div>
    </Link>
  );
};
export default Card;
