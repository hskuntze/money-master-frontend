import { Item } from "types/item";
import "./styles.css";
import { formatNumberToMoney, formatStringToDate } from "util/formatters";
import { Link } from "react-router-dom";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "util/requests";
import { toast } from "react-toastify";

interface Props {
  id: number;
  title: string;
  description: string;
  toBuyAt: string;
  totalValue: number;
  enabled: boolean;
  installment: boolean;
  sideElement?: boolean;
  elements?: Item[];
  onUpdate: () => void;
  onDelete: () => void;
}

const WishlistEntry = ({
  id,
  title,
  description,
  toBuyAt,
  totalValue,
  enabled,
  installment,
  elements,
  sideElement = false,
  onUpdate,
  onDelete,
}: Props) => {
  function formatItemId(title: string) {
    title = title.replaceAll(" ", "-");
    return "wishlist-entry-" + title.toLocaleLowerCase();
  }

  function returnLastItemPrice(item: Item) {
    let index = item.itemHistory.itemPrices.length - 1;
    if (item.itemHistory.itemPrices.at(index) !== undefined) {
      return formatNumberToMoney(item.itemHistory.itemPrices[index].price);
    }
  }

  function updateItemBasedOnLink(item: Item) {
    const params: AxiosRequestConfig = {
      url: "/items/update/bylink",
      method: "PUT",
      withCredentials: true,
      data: {
        id: item.id,
      },
    };

    requestBackend(params)
      .then((res) => {
        onUpdate();
        toast.success("Item updated successfully");
      })
      .catch((err) => {
        toast.error("Couldn't updated this item. Try again later.");
        console.log(err);
      });
  }

  function deleteItem(item: Item) {
    let confirm = window.confirm("Are you sure you want to delete this item?");

    if (confirm) {
      const params: AxiosRequestConfig = {
        url: `/items/delete/${item.id}`,
        method: "DELETE",
        withCredentials: true,
      };

      requestBackend(params)
        .then((res) => {
          onDelete();
          toast.success("Deleted successfully.");
        })
        .catch((err) => {
          toast.error("Couldn't delete this item. Try again later.");
        });
    }
  }

  function deleteWishlist(id: number) {
    let confirm = window.confirm(
      "Are you sure you want to delete this wishlist?"
    );

    if (confirm) {
      const params: AxiosRequestConfig = {
        url: `/wishlists/delete/${id}`,
        method: "DELETE",
        withCredentials: true,
      };

      requestBackend(params)
        .then((res) => {
          onDelete();
          toast.success("Deleted successfully.");
        })
        .catch((err) => {
          toast.error("Couldn't delete this wishlist. Try again later.");
        });
    }
  }

  return (
    <>
      {sideElement ? (
        <div
          className="wishlist-entry-container side-entry"
          id={formatItemId(title)}
        >
          <div className="wishlist-entry">
            <span className="wishlist-entry-title">{title}</span>
          </div>
          <button type="button" className="wishlist-entry-edit-button">
            <i className="bi bi-pencil-square" />
          </button>
        </div>
      ) : (
        <div
          className="wishlist-entry-container whole-entry"
          id={formatItemId(title) + "-" + id}
        >
          <div className="wishlist-whole-entry">
            {/**
             * Lado ESQUERDO do card
             */}
            <div className="wishlist-whole-entry-left">
              <div className="wwel-row">
                <div className="wwel-column">
                  <h2 className="wweh-title">{title}</h2>
                  <span className="wweh-description">{description}</span>
                  <span className="wweh-data">
                    Total value:{" "}
                    <span className="underline ml-1">
                      {formatNumberToMoney(totalValue)}
                    </span>
                  </span>
                  <span className="wweh-data">
                    Predicted date to buy:{" "}
                    <span className="underline ml-1">
                      {formatStringToDate(toBuyAt)}
                    </span>
                  </span>
                  <span className="wweh-data">
                    Is it enabled?{" "}
                    <span className="underline ml-1">
                      {enabled ? "Yes" : "No"}
                    </span>
                  </span>
                </div>
              </div>
              <div className="wwel-row">
                <Link className="wwel-button" to={`/items`}>
                  Add item
                </Link>
                <Link className="wwel-button" to={`/wishlists/${id}`}>
                  Edit wishlist
                </Link>
                <button
                  type="button"
                  className="wwel-button"
                  onClick={() => deleteWishlist(id)}
                >
                  Delete wishlist
                </button>
              </div>
            </div>

            {/**
             * Lado DIREITO do card
             */}
            <div className="wishlist-whole-entry-right">
              {elements?.map((el) => (
                <div
                  key={formatItemId(title) + "-" + id}
                  className="wishlist-whole-entry-item"
                >
                  <div className="wwei-left">
                    <div className="wwei-img">
                      <img src={el.image} alt={el.name + " image"} />
                    </div>
                  </div>
                  <div className="wwei-right">
                    <div className="wwei-title">
                      <span>{el.name}</span>
                      <div className="wwei-right-buttons">
                        <button
                          type="button"
                          className="wwei-right-button"
                          onClick={() => updateItemBasedOnLink(el)}
                        >
                          <i className="bi bi-arrow-repeat" />
                        </button>
                        <button
                          type="button"
                          className="wwei-right-button"
                          onClick={() => deleteItem(el)}
                        >
                          <i className="bi bi-trash-fill" />
                        </button>
                      </div>
                    </div>
                    <div className="wwei-price-and-source">
                      <div className="wwei-price">
                        <span>{formatNumberToMoney(el.price)}</span>
                      </div>
                      <div className="wwei-source-name">
                        <span>at {el.sourcePlatformName}</span>
                      </div>
                    </div>
                    <div className="wwei-link">
                      <a target="_blank" rel="noreferrer" href={el.link}>
                        Link to the product page
                      </a>
                    </div>
                    <div className="wwei-item-history">
                      Last price registered: {returnLastItemPrice(el)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WishlistEntry;
