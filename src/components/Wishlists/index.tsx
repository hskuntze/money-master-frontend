import "./styles.css";
import WishlistItem from "components/WishlistItem";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "util/requests";
import { useCallback, useEffect, useState } from "react";
import { SpringPage } from "types/springpage";
import { Wishlist } from "types/wishlist";
import Pagination from "components/Pagination";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { saveWishlistData } from "util/storage";

type ComponentData = {
  activePage: number;
  title: string;
};

const Wishlists = () => {
  const [wishlists, setWishlists] = useState<SpringPage<Wishlist>>();
  const [componentData, setComponentData] = useState<ComponentData>({
    activePage: 0,
    title: "",
  });

  const { register, handleSubmit, setValue } = useForm<ComponentData>();

  const loadInfo = useCallback(() => {
    const params: AxiosRequestConfig = {
      url: "/wishlists/user/filter",
      method: "GET",
      withCredentials: true,
      params: {
        size: 5,
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
  }, [componentData]);

  useEffect(() => {
    loadInfo();
  }, [loadInfo]);

  const handlePageChange = (pageNumber: number) => {
    setComponentData({
      activePage: pageNumber,
      title: componentData.title,
    });
  };

  const handleClearFilter = () => {
    setValue("title", "");
    onSubmit({activePage:0, title: ""});
  }

  const onSubmit = (filter: ComponentData) => {
    const params: AxiosRequestConfig = {
      url: "/wishlists/user/filter",
      method: "GET",
      withCredentials: true,
      params: {
        size: 5,
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

  return (
    <div className="wishlist-outter-container box-shadow side-element">
      <div className="wishlist-header">
        <span className="wishlist-title">Wishlists</span>
        <div className="wishlist-component-filter">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="wishlist-componenet-filter-input">
              <input
                type="text"
                placeholder="Filter"
                {...register("title")}
              />
              <button
                type="button"
                className="wishlist-componenet-filter-input-clear"
                onClick={handleClearFilter}
              >
                <i className="bi bi-x-circle" />
              </button>
            </div>
            <button type="button" className="wishlist-componenet-filter-button">
              <i className="bi bi-search" />
            </button>
          </form>
        </div>
      </div>
      <div className="wishlist-inner-container">
        {wishlists !== undefined &&
          wishlists.content.map((wishlist) => (
            <WishlistItem
              key={wishlist.id}
              id={wishlist.id}
              title={wishlist.title}
            />
          ))}
      </div>
      <Pagination
        pageCount={wishlists ? wishlists.totalPages : 0}
        forcePage={wishlists?.number}
        range={2}
        onChange={handlePageChange}
        width={230}
      />
    </div>
  );
};

export default Wishlists;
