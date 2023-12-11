import Navbar from "components/Navbar";
import Home from "pages/Home";
import { BrowserRouter, Route, Routes as Switch } from "react-router-dom";

const Routes = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Switch>
        <Route path="/" element={<Home />} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;