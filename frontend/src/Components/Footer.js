import { Link, NavLink } from "react-router-dom";
import { COLORS } from "../assets/colors";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";

const Footer = () => {
  const options = [
    { name: "Home", route: "/" },
    { name: "Party", route: "/party" },
    { name: "Ledger", route: "/ledger" },
    { name: "Payment", route: "/payment" },
  ];
  return (
    <MaxWidthWrapper>
      <div className="w-full relative flex flex-col gap-4 py-10 ">
        <div className="flex flex-row justify-between flex-wrap gap-y-4">
          <div>
            <h1
              style={{ color: COLORS.darkText }}
              className="font-bold text-base md:text-xl"
            >
              Collection Tailor
            </h1>
          </div>
          <div className="flex flex-row gap-4 md:gap-8">
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
        </div>

        <div
          style={{ backgroundColor: COLORS.cardBg }}
          className=" flex flex-col md:flex-row justify-between p-5 flex-wrap items-center gap-4"
        >
          <h1 className="underline text-sm font-medium">Terms & Condition</h1>
          <h1 className="text-sm font-medium">
            @ 2019 collection tailor.all rights reserved
          </h1>
          <div className="flex flex-row gap-6">
            <FaFacebookF size={18} />
            <FaInstagram size={18} />
            <FaTwitter size={18} />
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default Footer;
