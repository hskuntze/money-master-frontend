import "./styles.css";
import WishlistForm from "./WishlistForm";
import WishlistList from "./WishlistList";
import { Route, Routes } from "react-router-dom";

const Wishlists = () => {
  return (
    <section id="wishlists" className="wishlists-container">
      <div className="wishlist-content">
        <Routes>
          <Route path="" element={<WishlistList />} />
          <Route path=":id" element={<WishlistForm />} />
        </Routes>
      </div>
    </section>
  );
};

export default Wishlists;
