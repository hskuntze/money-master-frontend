import Navbar from "components/Navbar";
import { BrowserRouter, Route, Routes as Switch } from "react-router-dom";
import ConfirmRegistration from "pages/ConfirmRegistration";
import Auth from "pages/Auth";
import Home from "pages/Home";

const Routes = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Switch>
        <Route path="/" element={<Home />} />
        <Route path="/auth/*" element={<Auth />} />
        <Route path="/confirmregistration" element={<ConfirmRegistration />} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;