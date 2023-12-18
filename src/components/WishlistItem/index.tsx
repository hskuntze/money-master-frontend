import "./styles.css";

interface Props {
  id: number;
  title: string;
}

const WishlistItem = ({ title, id }: Props) => {
  function formatItemId(title: string, id: number) {
    return "wishlist-item-" + title.toLocaleLowerCase() + "-" + id;
  }

  return (
    <div className="wishlist-item-container" id={formatItemId(title, id)}>
      <div className="wishlist-item">
        <span className="wishlist-item-title">{title}</span>
      </div>
      <button type="button" className="wishlist-item-edit-button">
        <i className="bi bi-pencil-square" />
      </button>
    </div>
  );
};

export default WishlistItem;
