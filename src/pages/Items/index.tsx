import { Route, Routes } from "react-router-dom";
import "./styles.css";
import ItemSearch from "./ItemSearch";

const Items = () => {
  return (
    <section
      id="items-page-container"
      className="items-page-container"
    >
      <div className="items-page-content">
        <Routes>
          <Route path=":id" element={<ItemSearch />} />
        </Routes>
      </div>
    </section>
  );
};

export default Items;
