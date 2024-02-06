import WishlistsList from "components/WishlistsList";
import "./styles.css";

const Wishlists = () => {
  return (
    <section id="wishlists" className="wishlists-container">
      <div className="wishlist-content">
        <WishlistsList />
      </div>
    </section>
  );
};

export default Wishlists;
