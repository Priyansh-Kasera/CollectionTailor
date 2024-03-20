import { Link, NavLink } from "react-router-dom";
import { MdCancel } from "react-icons/md";
import { COLORS } from "../assets/colors";
import { cn } from "../Utility/helper";
import { IoMdLogIn, IoMdLogOut, IoMdMenu } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";

const SideNav = ({
  menu,
  showSideNav,
  setShowSideNav,
  isLoggedIn,
  handleLogout,
}) => {
  const showHideSideNave = () => {
    setShowSideNav(!showSideNav);
  };
  const logout = () => {
    setShowSideNav(false);
    handleLogout();
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
        <div className="absolute top-0 w-full items-center p-4 flex flex-row justify-between">
          <p className="font-bold text-lg md:text-2xl">Collection Tailor</p>
          <MdCancel
            onClick={showHideSideNave}
            size={28}
            color={COLORS.slate}
            className=" focus:outline-none"
          />
        </div>

        <br />
        <div className="w-full flex flex-col mt-10">
          {menu.map((item, index) => (
            <NavLink
              to={item.route}
              key={index}
              className={({ isActive }) => (isActive ? "bg-slate500" : "")}
            >
              <div className="p-2 mx-2 border-gray-700">
                <h1
                  className="text-lg font-medium capitalize"
                  style={{ color: COLORS.darkText }}
                >
                  {item.name}
                </h1>
              </div>
            </NavLink>
          ))}
        </div>

        <div className="w-full flex flex-col absolute bottom-10">
          <Link to="/user">
            <div className="p-2 mx-2 flex flex-row gap-4 items-center border-gray-700">
              <FaRegUser size={20} color={COLORS.darkText} />
              <h1
                className="text-lg font-medium capitalize"
                style={{ color: COLORS.darkText }}
              >
                Profile
              </h1>
            </div>
          </Link>
          {isLoggedIn ? (
            <div
              className="p-2 mx-2 flex flex-row items-center gap-4 border-gray-700"
              onClick={logout}
            >
              <IoMdLogOut size={22} color={COLORS.darkText} />
              <h1
                className="text-lg font-medium capitalize"
                style={{ color: COLORS.darkText }}
              >
                Log Out
              </h1>
            </div>
          ) : (
            <Link to="/sign-in">
              <div className="p-2 mx-2 flex flex-row items-center gap-4 border-gray-700">
                <IoMdLogIn size={22} color={COLORS.darkText} />
                <h1
                  className="text-lg font-medium capitalize"
                  style={{ color: COLORS.darkText }}
                >
                  Log In
                </h1>
              </div>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default SideNav;
