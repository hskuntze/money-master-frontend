import "./assets/styles/custom.scss";
import "bootstrap/dist/js/bootstrap.bundle";
import "react-toastify/dist/ReactToastify.min.css";
import "./App.css";
import Routes from "./Routes";
import { useState } from "react";
import { AuthContext, AuthContextData } from "AuthContext";
import { ToastContainer } from "react-toastify";
import { UserContext, UserContextData } from "UserContext";
import { getUserData } from "util/storage";

function App() {
  const [authContextData, setAuthContextData] = useState<AuthContextData>({
    authenticated: false,
  });

  const [userContextData, setUserContextData] = useState<UserContextData>({
    user: getUserData()
  });

  return (
    <AuthContext.Provider value={{ authContextData, setAuthContextData }}>
      <UserContext.Provider value={{ userContextData, setUserContextData }}>
        <Routes />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </UserContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
