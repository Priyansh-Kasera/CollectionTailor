import { Link } from "react-router-dom";
import { COLORS } from "../assets/colors";
import AppButton from "../Components/AppButton";
import landingImage from "../Images/image2.jpg";
import Layout from "./Layout";
import Loader from "../Components/Loader";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import MaxWidthWrapper from "../Components/MaxWidthWrapper";
import { BiLeaf } from "react-icons/bi";
import { LuArrowDownToLine } from "react-icons/lu";
import { FiCheckCircle } from "react-icons/fi";

const Landing = () => {
  const perks = [
    {
      name: "Instant Delivery",
      icon: LuArrowDownToLine,
      description:
        "Receive your clothing delivery directly to your doorstep within the span of just one week.",
    },
    {
      name: "Guaranteed Quality",
      icon: FiCheckCircle,
      description:
        "Every material in our platform is varified by our team to ensure highest quality and standards. Not happy? We offer a 30-day refuned guarantee.",
    },
    {
      name: "For the Planet",
      icon: BiLeaf,
      description:
        "We've pledged 1% of sales to the preservation and restoration of the natural environment.",
    },
  ];
  return (
    <>
      <div
        className="relative min-h-screen flex flex-col"
        style={{ backgroundColor: COLORS.background }}
      >
        <Loader visible={true} />
        <Header />
        <div className="flex-grow flex-1 relative flex flex-col py-4 md:py-10">
          <div
            className="flex flex-col w-full relative min-h-96"
            style={{ backgroundColor: COLORS.imageBG }}
          >
            <MaxWidthWrapper className="h-full">
              <div className="flex flex-col lg:flex-row gap-5 w-full relative h-full pb-10 lg:pb-0">
                <div className="w-full lg:w-3/5 h-full">
                  <img
                    src={landingImage}
                    className=" h-full w-full"
                    style={{
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                </div>
                <div className="w-full lg:w-2/5 h-full flex flex-col items-center justify-center gap-6 pt-10 lg:pt-24">
                  <h1 className="text-center text-3xl lg:text-5xl font-bold">
                    Crafting Elegance
                  </h1>

                  <h4 className="text-center text-lg  lg:text-2xl font-semibold">
                    Where Every Stitch Tells a Story of Style and Sophistication
                  </h4>
                  <div className="flex flex-col  lg:flex-row justify-center gap-4 lg:gap-12  lg:mt-10">
                    <Link to="/bill/create">
                      <AppButton
                        label="Create Bill"
                        type="second"
                        className="!w-48 py-2"
                      />
                    </Link>

                    <Link to="/bill">
                      <AppButton
                        label="Bills"
                        type="second"
                        className="!w-48 py-2"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </MaxWidthWrapper>
          </div>
          <div>
            <MaxWidthWrapper className="py-20">
              <div className="grid grid-cols-1 grid-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 gap-y-8 lg:gap-y-0">
                {perks.map((perk) => (
                  <div
                    key={perk.name}
                    className="text-center md:flex md:items-start md:text-left lg:block lg:text-center"
                  >
                    <div className="md:flex-shrink-0 flex justify-center">
                      <div
                        className="h-16 w-16 flex items-center justify-center rounded-full"
                        style={{
                          backgroundColor: COLORS.slate,
                          color: COLORS.background,
                        }}
                      >
                        <perk.icon className="w-1/3 h-1/3" />
                      </div>
                    </div>
                    <div className="mt-6 md:ml-4 md:mt-0 lg:mt-6 lg:ml-0">
                      <h3 className="text-base font-medium text-gray-900">
                        {perk.name}
                      </h3>
                      <p className="mt-3 text-sm text-muted-foreground">
                        {perk.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </MaxWidthWrapper>
          </div>
        </div>
      </div>
      <Footer />
    </>

    // <Layout>
    //   <div className="relative w-full flex flex-col items-center bg">
    //     <div></div>
    //   </div>
    //   {/* <Link to="/bill/create">
    //           <AppButton
    //             label="Create Bill"
    //             type="second"
    //             className="w-52 py-2"
    //           />
    //         </Link>
    //         <Link to="/bill">
    //           <AppButton label="Bills" type="second" className="w-52 py-2" />
    //     </Link> */}
    // </Layout>
  );
};
export default Landing;
