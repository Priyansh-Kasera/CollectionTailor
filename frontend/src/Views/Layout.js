import MaxWidthWrapper from "../Components/MaxWidthWrapper";
import { COLORS } from "../assets/colors";
import Header from "../Components/Header";
import Loader from "../Components/Loader";
import SideNav from "../Components/SideNav";
import Footer from "../Components/Footer";
import { useEffect } from "react";
import { makeRequest } from "../service/apiconfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const Layout = ({ children, check = true }) => {
  const navigate = useNavigate();
  useEffect(() => {
    // is user logged in
    if (check) {
      makeRequest("/isLoggedIn", "GET", null, isUserLoggedInCB);
    }
  }, []);

  const isUserLoggedInCB = (result) => {
    if (!result?.success) {
      navigate("/sign-in");
    }
  };
  return (
    <div
      className="relative min-h-screen flex flex-col"
      style={{ backgroundColor: COLORS.background }}
    >
      <Loader visible={true} />
      <Header />
      <div className="flex-grow flex-1 relative flex flex-col py-4 md:py-10">
        <MaxWidthWrapper>{children}</MaxWidthWrapper>
      </div>
      <Footer />
    </div>
  );
};
export default Layout;
