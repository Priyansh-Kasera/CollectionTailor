import logo from "./logo.svg";
import "./App.css";
import MaxWidthWrapper from "./Components/MaxWidthWrapper";
import { COLORS } from "./assets/colors";
import Home from "./Views/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Components/Header";

function App() {
  return (
    <div
      className="relative min-h-screen flex flex-col"
      style={{ backgroundColor: COLORS.background }}
    >
      <ToastContainer
        position="top-center"
        autoClose={3000}
        pauseOnHover={false}
        toastStyle={{ backgroundColor: COLORS.background }}
      />
      <Home />
    </div>
  );
}

export default App;
