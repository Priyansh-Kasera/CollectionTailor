import { COLORS } from "../assets/colors";
import { Link, NavLink } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { IoMdMenu } from "react-icons/io";
import SideNav from "./SideNav";
import { useState } from "react";

const Header = () => {
  const options = [
    { name: "Home", route: "/" },
    { name: "Party", route: "/party" },
    { name: "Ledger", route: "/ledger" },
    { name: "Payment", route: "/payment" },
  ];

  const [showSideNav, setShowSideNav] = useState(false);

  const showHideSideNave = () => {
    setShowSideNav(!showSideNav);
  };
  return (
    <div
      className="sticky z-50 top-0 inset-x-0 h-16 flex"
      style={{ backgroundColor: COLORS.background }}
    >
      <MaxWidthWrapper>
        <div className=" w-full flex flex-row justify-start gap-6 lg:gap-0 lg:justify-between items-center py-4">
          <div className="block lg:hidden">
            <SideNav
              menu={options}
              showSideNav={showSideNav}
              setShowSideNav={setShowSideNav}
            />
          </div>
          <div>
            <h1
              style={{ color: COLORS.darkText }}
              className="font-bold text-lg md:text-2xl"
            >
              Collection Tailor
            </h1>
          </div>
          <div className=" hidden lg:flex flex-row gap-12  items-center">
            {options.map((option, index) => (
              <NavLink
                to={`${option.route}`}
                key={index}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <div
                  key={index}
                  className="hover:border-b-2 cursor-pointer"
                  style={{ borderColor: COLORS.cardBg }}
                >
                  <p>{option.name}</p>
                </div>
              </NavLink>
            ))}
          </div>
          <div className="hidden lg:flex flex-row items-center gap-8  md:gap-12">
            <FaRegUser size={22} color={COLORS.darkText} />
            <IoMdLogOut size={22} color={COLORS.darkText} />
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};
export default Header;
