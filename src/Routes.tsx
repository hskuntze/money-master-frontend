import Navbar from "components/Navbar";
import { BrowserRouter, Route, Routes as Switch } from "react-router-dom";
import ConfirmRegistration from "pages/ConfirmRegistration";
import Auth from "pages/Auth";
import Home from "pages/Home";
import { useState } from "react";
import { ThemeContext, ThemeContextData } from "ThemeContext";

const Routes = () => {
  const [themeContextData, setThemeContextData] = useState<ThemeContextData>({
    theme: "light",
  });

  return (
    <BrowserRouter>
      <ThemeContext.Provider value={{themeContextData, setThemeContextData}}>
        <Navbar />
        <Switch>
          <Route path="/" element={<Home />} />
          <Route path="/auth/*" element={<Auth />} />
          <Route
            path="/confirmregistration"
            element={<ConfirmRegistration />}
          />
        </Switch>
      </ThemeContext.Provider>
    </BrowserRouter>
  );
};

export default Routes;
