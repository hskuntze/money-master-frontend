import { Controller, useForm } from "react-hook-form";
import "./styles.css";
import { useState } from "react";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "util/requests";
import { ScrapingItem as ScrapingItemType } from "types/scrapingitem";
import { toast } from "react-toastify";
import ScrapingItem from "components/ScrapingItem";
import Loader from "components/Loader";
import { useParams } from "react-router-dom";

type FormData = {
  product: string;
  platforms: string[];
};

type UrlParams = {
  id: string;
}

const ItemSearch = () => {
  const { register, handleSubmit, control } = useForm<FormData>();

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [items, setItems] = useState<ScrapingItemType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const urlParams = useParams<UrlParams>();

  const handlePlatformChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.target;

    if (checked) {
      setSelectedPlatforms((prevPlatforms) => [...prevPlatforms, value]);
    } else {
      setSelectedPlatforms((prevPlatforms) =>
        prevPlatforms.filter((platform) => platform !== value)
      );
    }
  };

  const onSubmit = (formData: FormData) => {
    setLoading(true);
    formData.platforms = selectedPlatforms;

    const params: AxiosRequestConfig = {
      url: "/scraping/search",
      method: "GET",
      withCredentials: true,
      params: {
        item: formData.product,
        sources: formData.platforms.join(","),
      },
    };

    requestBackend(params)
      .then((res) => {
        setItems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Error while searching for items. Try again.");
        setLoading(false);
      });
  };

  return (
    <div className="item-search-container">
      <div className="item-search-content">
        <form onSubmit={handleSubmit(onSubmit)} className="item-search-form">
          <div className="item-search-bar-container">
            <input
              id="item-search-bar"
              {...register("product")}
              placeholder="Search here for your desired product"
              className="item-search-bar"
              type="text"
            />
            <button className="item-search-btt" type="submit">
              <i className="bi bi-search" />
            </button>
          </div>
          <div className="item-sources-container">
            <div>
              <Controller
                name="platforms"
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    id="kabum"
                    {...register("platforms")}
                    onChange={handlePlatformChange}
                    value={"KABUM"}
                  />
                )}
              />
              <label htmlFor="kabum">Kabum</label>
            </div>
            <div>
              <Controller
                name="platforms"
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    id="aliexpress"
                    {...register("platforms")}
                    onChange={handlePlatformChange}
                    value={"ALI_EXPRESS"}
                  />
                )}
              />
              <label htmlFor="aliexpress">Ali Express</label>
            </div>
            <div>
              <Controller
                name="platforms"
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    id="shein"
                    {...register("platforms")}
                    onChange={handlePlatformChange}
                    value={"SHEIN"}
                  />
                )}
              />
              <label htmlFor="shein">Shein</label>
            </div>
            <div>
              <Controller
                name="platforms"
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    id="mercadolivre"
                    {...register("platforms")}
                    onChange={handlePlatformChange}
                    value={"MERCADO_LIVRE"}
                  />
                )}
              />
              <label htmlFor="mercadolivre">Mercado Livre</label>
            </div>
            <div>
              <Controller
                name="platforms"
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    id="amazon"
                    {...register("platforms")}
                    onChange={handlePlatformChange}
                    value={"AMAZON"}
                  />
                )}
              />
              <label htmlFor="amazon">Amazon</label>
            </div>
            <div>
              <Controller
                name="platforms"
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    id="magazineluiza"
                    {...register("platforms")}
                    onChange={handlePlatformChange}
                    value={"MAGAZINE_LUIZA"}
                  />
                )}
              />
              <label htmlFor="magazineluiza">Magazine Luiza</label>
            </div>
          </div>
        </form>
        {loading ? (
          <Loader />
        ) : (
          <div className="item-search-listing">
            {items &&
              items.length > 0 &&
              items.map((item, index) => (
                <ScrapingItem wishlistId={urlParams.id} item={item} key={index} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemSearch;
