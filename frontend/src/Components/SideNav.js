import { Link } from "react-router-dom";
import { MdCancel } from "react-icons/md";
import { COLORS } from "../assets/colors";
import { cn } from "../Utility/helper";
import { IoMdMenu } from "react-icons/io";

const SideNav = ({ menu, showSideNav, setShowSideNav }) => {
  const showHideSideNave = () => {
    setShowSideNav(!showSideNav);
  };
  return (
    <>
      <IoMdMenu size={22} color={COLORS.darkText} onClick={showHideSideNave} />
      <div
        className={cn(
          "fixed top-0 h-full w-64 -left-64 text-black transition-transform duration-300 transform translate-x-0 z-50",
          showSideNav ? "translate-x-64" : "translate-x-0"
        )}
        style={{ backgroundColor: COLORS.imageBG }}
      >
        <MdCancel
          onClick={showHideSideNave}
          size={28}
          color={COLORS.slate}
          className="absolute top-0 right-0 m-4 focus:outline-none"
        />

        <br />
        <div className="w-full flex flex-col mt-10">
          {menu.map((item) => (
            <Link to={item.route} className="w-full">
              <div className="p-2 mx-2 border-b border-gray-700">
                <h1
                  className="text-lg font-medium capitalize"
                  style={{ color: COLORS.darkText }}
                >
                  {item.name}
                </h1>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default SideNav;
