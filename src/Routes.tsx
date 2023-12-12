import Navbar from "components/Navbar";
import Auth from "pages/Auth";
import Home from "pages/Home";
import { BrowserRouter, Route, Routes as Switch } from "react-router-dom";

const Routes = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Switch>
        <Route path="/" element={<Home />} />
        <Route path="/auth/*" element={<Auth />} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;