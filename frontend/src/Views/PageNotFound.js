import Header from "../Components/Header";
import MaxWidthWrapper from "../Components/MaxWidthWrapper";
import { COLORS } from "../assets/colors";
import Layout from "./Layout";
import image from "../Images/not-found.png";
import { Link } from "react-router-dom";
const PageNotFound = ({}) => {
  return (
    <div
      className="relative min-h-screen flex flex-col"
      style={{ backgroundColor: COLORS.background }}
    >
      <Header />
      <div className="flex-grow flex-1 relative flex flex-col py-4 md:py-10">
        <MaxWidthWrapper className={"flex-1 flex flex-col"}>
          <div className="relative flex-1 h-full w-full flex flex-col lg:flex-row  items-start lg:items-center justify-start lg:justify-center gap-4 lg:gap-0">
            <div className="lg:flex-1 w-full">
              <div className="w-full h-96 ">
                <img
                  src={image}
                  className="w-full h-full object-contain object-center"
                />
              </div>
            </div>
            <div className="lg:flex-1">
              <span className="border-b pb-2 border-black">Error </span>
              <span>404</span>
              <div className="mt-4 lg:mt-8">
                <h1 className="text-4xl lg:text-6xl font-bold">there is</h1>
                <h1 className="text-4xl lg:text-6xl font-bold">
                  light in here too.
                </h1>
              </div>
              <div className="mt-4 lg:mt-8">
                <p className="font-light text-base lg:text-lg">
                  But the page is missing or you assembled the link incorrectly.
                </p>
              </div>
              <div className="mt-4 lg:mt-8">
                <Link to="/" className="">
                  <p className="font-medium text-base  lg:text-lg">
                    Go Home &rarr;
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
    </div>
  );
};
export default PageNotFound;
