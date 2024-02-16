import { ScrapingItem as ScrapingItemType } from "types/scrapingitem";
import "./styles.css";
import { formatNumberToMoney } from "util/formatters";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "util/requests";
import { toast } from "react-toastify";

interface Props {
  item: ScrapingItemType;
  wishlistId: string | undefined;
}

const ScrapingItem = ({ item, wishlistId }: Props) => {
  const source = {
    "Ali Express": 0,
    Amazon: 1,
    "Mercado Livre": 2,
    Shein: 3,
    "Magazine Luiza": 4,
    Kabum: 5,
  };

  const compareToKey = () => {
    for (const [key, value] of Object.entries(source)) {
      if (key === item.sourcePlatformName) {
        return value;
      }
    }
  };

  const addToWishlist = () => {
    let confirm = window.confirm(
      `Do you want to add this item to the wishlist?`
    );

    if (confirm) {
      let sourceId = compareToKey();

      const params: AxiosRequestConfig = {
        url: `/items/register/onWishlist/${wishlistId}`,
        method: "POST",
        withCredentials: true,
        data: {
          price: item.price,
          name: item.name,
          link: item.link,
          image: item.image,
          sourcePlatform: sourceId,
        },
      };

      requestBackend(params)
        .then((res) => {
          toast.success("Successfully added.");
        })
        .catch((err) => {
          toast.error("Unable to add this item to the wishlist. Try again later.");
        });
    }
  };

  return (
    <div className="s-item-container">
      <div className="s-item-content">
        <img
          className="s-item-image"
          src={item.image}
          alt={"picture for " + item.name}
        />
        <h4 className="s-item-title">{item.name}</h4>
        <h5 className="s-item-price">
          <span className="currency-syboml">R$</span>
          {formatNumberToMoney(item.price).substring(3)}
        </h5>
        <span className="s-item-source">at {item.sourcePlatformName}</span>
        <a
          className="s-item-link"
          href={item.link}
          target="_blank"
          rel="noreferrer"
        >
          Product page
        </a>
        <button
          onClick={addToWishlist}
          type="button"
          className="s-item-add-wishlist-btt"
        >
          Add to wishlist
        </button>
      </div>
    </div>
  );
};

export default ScrapingItem;
