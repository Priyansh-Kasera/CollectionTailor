import { COLORS } from "../assets/colors";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { IoMdLogIn, IoMdLogOut } from "react-icons/io";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { IoMdMenu } from "react-icons/io";
import SideNav from "./SideNav";
import { useState } from "react";
import logo from "../Images/logo3.png";
import { makeRequest } from "../service/apiconfig";
import { toast } from "react-toastify";
import { useEffect } from "react";

const Header = () => {
  const options = [
    { name: "Home", route: "/" },
    { name: "Party", route: "/party" },
    { name: "Ledger", route: "/ledger" },
    { name: "Payment", route: "/payment" },
  ];

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const url = window.location.pathname;
  const navigate = useNavigate();

  useEffect(() => {
    if (url !== "/") {
      makeRequest("/isLoggedIn", "GET", null, isUserLoggedInCB, true);
    }
  }, []);

  const isUserLoggedInCB = (result) => {
    if (result?.success) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      navigate("/sign-in");
    }
  };

  const [showSideNav, setShowSideNav] = useState(false);

  const showHideSideNave = () => {
    setShowSideNav(!showSideNav);
  };

  const handleLogout = () => {
    makeRequest("/logout", "GET", null, logOutCB);
  };

  const logOutCB = (res) => {
    if (res.success) {
      toast.success("Logout successfully.");
      navigate("/");
      setIsLoggedIn(false);
    } else {
      toast.error(res.message);
    }
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
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              handleLogout={handleLogout}
            />
          </div>
          <div className="flex flex-row gap-5 items-center">
            <img
              src={logo}
              className="w-1/10 aspect-auto object-contain object-center"
            />
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
            <Link to="/user">
              <FaRegUser size={22} color={COLORS.darkText} />
            </Link>
            {isLoggedIn ? (
              <IoMdLogOut
                size={22}
                color={COLORS.darkText}
                onClick={handleLogout}
              />
            ) : (
              <Link to="/sign-in">
                <IoMdLogIn size={22} color={COLORS.darkText} />
              </Link>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};
export default Header;
