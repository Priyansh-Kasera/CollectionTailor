import { COLORS } from "../assets/colors";

const Heading = ({ title }) => {
  return (
    <h1
      className="text-xl md:text-4xl font-bold items-start mr-auto capitalize"
      style={{ color: COLORS.darkText }}
    >
      {title}
    </h1>
  );
};

export default Heading;
