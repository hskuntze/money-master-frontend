import { Route, Routes } from "react-router-dom";
import "./styles.css";
import ItemSearch from "./ItemSearch";

const Items = () => {
  return (
    <section
      id="items-home-page-container"
      className="items-home-page-container"
    >
      <div className="items-home-page-content">
        <Routes>
          <Route path="" element={<ItemSearch />} />
        </Routes>
      </div>
    </section>
  );
};

export default Items;
