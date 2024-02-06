import Navbar from "components/Navbar";
import { BrowserRouter, Route, Routes as Switch } from "react-router-dom";
import ConfirmRegistration from "pages/ConfirmRegistration";
import Auth from "pages/Auth";
import Home from "pages/Home";
import { useState } from "react";
import { ThemeContext, ThemeContextData } from "ThemeContext";
import ExpenseTrack from "pages/ExpenseTrack";
import PrivateRoute from "PrivateRoute";
import Wishlists from "pages/Wishlists";

const Routes = () => {
  const [themeContextData, setThemeContextData] = useState<ThemeContextData>({
    theme: "light",
  });

  return (
    <BrowserRouter>
      <ThemeContext.Provider value={{ themeContextData, setThemeContextData }}>
        <Navbar />
        <main id="main" className="main-page">
          <Switch>
            <Route
              path="/"
              element={
                <PrivateRoute roles={["ROLE_ADMIN", "ROLE_USER"]}>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route path="/auth/*" element={<Auth />} />
            <Route
              path="/confirmregistration"
              element={<ConfirmRegistration />}
            />
            <Route
              path="/wishlists"
              element={
                <PrivateRoute roles={["ROLE_ADMIN", "ROLE_USER"]}>
                  <Wishlists />
                </PrivateRoute>
              }
            />
            <Route
              path="/expensetrack/*"
              element={
                <PrivateRoute roles={["ROLE_ADMIN", "ROLE_USER"]}>
                  <ExpenseTrack />
                </PrivateRoute>
              }
            />
          </Switch>
        </main>
      </ThemeContext.Provider>
    </BrowserRouter>
  );
};

export default Routes;
