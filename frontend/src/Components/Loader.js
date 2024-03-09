import { BallTriangle, Bars, Oval } from "react-loader-spinner";
import { COLORS } from "../assets/colors";

const Loader = ({ visible }) => {
  return (
    <div
      id="loader"
      className="w-full  h-full z-30  flex-col justify-center  backdrop-blur-[2px] items-center fixed "
      style={{ display: "none" }}
    >
      {/* <Oval
        visible={visible}
        height="80"
        width="80"
        color={COLORS.slate}
        secondaryColor={COLORS.slate}
        ariaLabel="oval-loading"
        wrapperStyle={{}}
        wrapperClass=""
        strokeWidth={4}
        strokeWidthSecondary={4}
      /> */}
      {/* <BallTriangle
        height={100}
        width={100}
        radius={5}
        color={COLORS.slate}
        ariaLabel="ball-triangle-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      /> */}
      <Bars
        height="80"
        width="80"
        color={COLORS.slate}
        ariaLabel="bars-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  );
};

export default Loader;
