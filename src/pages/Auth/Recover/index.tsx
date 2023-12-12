import { Route, Routes } from "react-router-dom";
import SendEmail from "./SendEmail";
import NewPassword from "./NewPassword";

const Recover = () => {
  return (
    <Routes>
      <Route path="" element={<SendEmail />} />
      <Route path=":token" element={<NewPassword />} />
    </Routes>
  );
};

export default Recover;