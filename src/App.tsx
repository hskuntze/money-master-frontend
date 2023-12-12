import "./assets/styles/custom.scss";
import "bootstrap/dist/js/bootstrap.bundle";
import "react-toastify/dist/ReactToastify.min.css";
import "./App.css";
import Routes from "./Routes";
import { useState } from "react";
import { AuthContext, AuthContextData } from "AuthContext";
import { ToastContainer } from "react-toastify";

function App() {
  const [authContextData, setAuthContextData] = useState<AuthContextData>({
    authenticated: false,
  });

  return (
    <AuthContext.Provider value={{ authContextData, setAuthContextData }}>
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
    </AuthContext.Provider>
  );
}

export default App;