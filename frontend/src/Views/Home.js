import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Landing from "./Landing";
import CreateParty from "./CreateParty";
import Party from "./Party";
import Payment from "./Payment";
import CreateBill from "./CreateBill";
import BillDetails from "./BillDetails";
import Bills from "./Bills";
import Leadger from "./Leadger";
import PageNotFound from "./PageNotFound";
import Profile from "./Profile";
import ChangePassword from "./ChangePassword";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

const Home = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/sign-in" element={<Login />} />
        <Route path="/party" element={<Party />} />
        <Route path="/party/:id" element={<CreateParty />} />
        <Route path="/party/create" element={<CreateParty />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment/:id" element={<Payment />} />
        <Route path="/bill/create" element={<CreateBill />} />
        <Route path="/bill/update/:id" element={<CreateBill />} />
        <Route path="/bill/:id" element={<BillDetails />} />
        <Route path="/bill" element={<Bills />} />
        <Route path="/ledger" element={<Leadger />} />
        <Route path="/user" element={<Profile />} />
        <Route path="/user/password/:id" element={<ChangePassword />} />
        <Route path="/user/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default Home;
