import "./styles.css";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "util/requests";
import { useCallback, useContext, useEffect, useState } from "react";
import { SpringPage } from "types/springpage";
import { Wishlist } from "types/wishlist";
import Pagination from "components/Pagination";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { saveWishlistData } from "util/storage";
import { ThemeContext } from "ThemeContext";
import WishlistEntry from "components/WishlistEntry";
import { Link } from "react-router-dom";

type ComponentData = {
  activePage: number;
  title: string;
};

interface Props {
  sideElement?: boolean;
}

const WishlistList = ({ sideElement = false }: Props) => {
  const [wishlists, setWishlists] = useState<SpringPage<Wishlist>>();
  const [componentData, setComponentData] = useState<ComponentData>({
    activePage: 0,
    title: "",
  });

  const { register, handleSubmit, setValue } = useForm<ComponentData>();

  const { themeContextData } = useContext(ThemeContext);

  const handlePageChange = (pageNumber: number) => {
    setComponentData({
      activePage: pageNumber,
      title: componentData.title,
    });
  };

  const handleClearFilter = () => {
    setValue("title", "");
    onSubmit({ activePage: 0, title: "" });
  };

  const loadInfo = useCallback(() => {
    const params: AxiosRequestConfig = {
      url: "/wishlists/user/filter",
      method: "GET",
      withCredentials: true,
      params: {
        size: sideElement ? 5 : 6,
        page: componentData.activePage,
        title: componentData.title,
      },
    };

    requestBackend(params)
      .then((res) => {
        setWishlists(res.data);
        saveWishlistData(res.data.content);
      })
      .catch((err) => {
        toast.error(err);
      });
  }, [componentData, sideElement]);

  const handleWishlistItemUpdateAndDelete = () => {
    loadInfo();
  };

  useEffect(() => {
    loadInfo();
  }, [loadInfo]);

  const onSubmit = (filter: ComponentData) => {
    const params: AxiosRequestConfig = {
      url: "/wishlists/user/filter",
      method: "GET",
      withCredentials: true,
      params: {
        size: sideElement ? 5 : 6,
        page: componentData.activePage,
        title: filter.title,
      },
    };

    requestBackend(params)
      .then((res) => {
        setWishlists(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const element = document.getElementById("wishlists-list") as HTMLDivElement;

    if (themeContextData.theme === "dark") {
      element.style.backgroundColor = "#073520";
    } else {
      element.style.backgroundColor = "#148C54";
    }
  }, [themeContextData.theme]);

  return (
    <div
      id="wishlists-list"
      className={`wishlist-outter-container box-shadow ${
        sideElement === true
          ? "side-wishlist-element"
          : "whole-wishlist-element"
      }`}
    >
      <div
        className={`wishlist-header ${
          sideElement ? "side-header" : "whole-header"
        }`}
      >
        <span className="wishlist-title">Wishlists</span>
        {!sideElement && (
          <div className="wishlist-add-button-container">
            <Link to={"/wishlists/create"} className="wishlist-add-button-wrapper">
              <button className="wishlist-add-button">New wishlist</button>
            </Link>
          </div>
        )}
        <div className="wishlist-component-filter">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="wishlist-component-filter-input">
              <input type="text" placeholder="Filter" {...register("title")} />
              <button
                type="button"
                className="wishlist-component-filter-input-clear"
                onClick={handleClearFilter}
              >
                <i className="bi bi-x-circle" />
              </button>
            </div>
            <button type="button" className="wishlist-component-filter-button">
              <i className="bi bi-search" />
            </button>
          </form>
        </div>
      </div>
      <div className="wishlist-inner-container">
        {wishlists !== undefined &&
          wishlists.content.map((wishlist) => (
            <WishlistEntry
              key={wishlist.id}
              id={wishlist.id}
              title={wishlist.title}
              description={wishlist.description}
              toBuyAt={wishlist.toBuyAt}
              totalValue={wishlist.totalValue}
              enabled={wishlist.enabled}
              installment={wishlist.installment}
              sideElement={sideElement}
              elements={wishlist.items}
              onDelete={handleWishlistItemUpdateAndDelete}
              onUpdate={handleWishlistItemUpdateAndDelete}
            />
          ))}
      </div>
      {wishlists?.totalElements &&
        wishlists.totalElements > (sideElement ? 5 : 6) && (
          <Pagination
            pageCount={wishlists ? wishlists.totalPages : 0}
            forcePage={wishlists?.number}
            range={2}
            onChange={handlePageChange}
            width={230}
          />
        )}
    </div>
  );
};

export default WishlistList;
