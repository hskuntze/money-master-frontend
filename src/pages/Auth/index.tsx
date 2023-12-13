import { Route, Routes } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Recover from "./Recover";
import InfoComponent from "components/InfoComponent";

const Auth = () => {
  return (
    <section className="auth-section">
      <InfoComponent />
      <Routes>
        <Route path="" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="recoverpassword/*" element={<Recover />} />
      </Routes>
    </section>
  );
};

export default Auth;
