import "./styles.css";
import { AxiosRequestConfig } from "axios";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { Wishlist } from "types/wishlist";
import { requestBackend } from "util/requests";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatDateToString } from "util/formatters";
import { toast } from "react-toastify";

type UrlParams = {
  id: string;
};

type FormData = {
  title: string;
  description: string;
  enabled: boolean;
  toBuyAt: string;
  installment: boolean;
};

const WishlistForm = () => {
  const urlParams = useParams<UrlParams>();
  const edit = urlParams.id !== "create";
  const [wishlistData, setWishlistData] = useState<Wishlist>();
  const [dateRequired, setDateRequired] = useState(false);

  const {
    handleSubmit,
    setValue,
    control,
    register,
    formState: { errors },
  } = useForm<FormData>();

  const loadInfo = useCallback(() => {
    if (edit) {
      const params: AxiosRequestConfig = {
        url: `/wishlists/${urlParams.id}`,
        withCredentials: true,
        method: "GET",
      };

      requestBackend(params)
        .then((res) => {
          const data = res.data as Wishlist;
          setWishlistData(data);

          setValue("title", data.title);
          setValue("description", data.description);
          setValue("enabled", data.enabled);
          setValue("installment", data.installment);
          setValue("toBuyAt", data.toBuyAt);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [urlParams.id, setValue, edit]);

  const onSubmit = (formData: FormData) => {
    if (formData.toBuyAt === undefined || formData.toBuyAt === null) {
      setDateRequired(true);
    } else {
      const params: AxiosRequestConfig = {
        url: edit ? `/wishlists/update/${urlParams.id}` : "/wishlists/register",
        method: edit ? "PUT" : "POST",
        withCredentials: true,
        data: formData,
      };

      requestBackend(params)
        .then((res) => {
          setDateRequired(false);
          toast.success("Saved successfully.");
        })
        .catch((err) => {
          toast.error(
            "Something went wrong while trying to save. Try again later."
          );
        });
    }
  };

  useEffect(() => {
    loadInfo();
  }, [loadInfo]);

  return (
    <div className="wishlist-form-outter-container">
      <div className="wishlist-form-inner-container">
        <h4 className="wishlist-form-container-title">
          {edit ? wishlistData?.title : "New wishlist"}
        </h4>
        <form className="wishlist-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="wishlist-form-input-container">
            <input
              type="text"
              className={`wishlist-form-input ${
                errors.title ? "is-invalid" : ""
              }`}
              id="wishlist-form-title"
              {...register("title", {
                required: "Required",
              })}
              placeholder="Title"
            />
            <div className="invalid-feedback d-block">
              {errors.title?.message}
            </div>
          </div>
          <div className="wishlist-form-input-container">
            <textarea
              id="wishlist-form-description"
              rows={5}
              {...register("description", {
                required: "Required. Max length is 255 characters.",
                maxLength: 255,
              })}
              placeholder="Description"
              className={`wishlist-form-input wishlist-form-textarea ${
                errors.description ? "is-invalid" : ""
              }`}
              maxLength={255}
            ></textarea>
            <div className="invalid-feedback d-block">
              {errors.description?.message}
            </div>
          </div>
          <div className="wishlist-form-input-container">
            <Controller
              name="toBuyAt"
              control={control}
              render={({ field }) => (
                <DatePicker
                  id="wishlist-form-to-buy-at"
                  selected={
                    edit && wishlistData
                      ? new Date(wishlistData.toBuyAt + "T03:00:00Z")
                      : null
                  }
                  placeholderText="Date to buy this wishlist items"
                  onChange={(date) => {
                    if (wishlistData) {
                      wishlistData.toBuyAt = formatDateToString(date);
                      setWishlistData(wishlistData);
                    }
                  }}
                  onSelect={(date) =>
                    setValue("toBuyAt", formatDateToString(date))
                  }
                  dateFormat={"dd/MM/yyyy"}
                  className="wishlist-form-date-picker date-picker"
                />
              )}
            />
            {dateRequired && (
              <div className="invalid-feedback d-block">Required</div>
            )}
          </div>
          <div className="wishlist-form-input-container">
            <div className="wishlist-form-checkbox-wrapper">
              <div className="wishlist-form-checkbox-auxdiv">
                <Controller
                  name="enabled"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      id="wishlist-form-enabled"
                      {...register("enabled")}
                      className={`wishlist-form-input wishlist-checkbox ${
                        errors.enabled ? "is-invalid" : ""
                      }`}
                    />
                  )}
                />
              </div>
              <label htmlFor="wishlist-form-enabled">Enabled?</label>
            </div>
          </div>
          <div className="wishlist-form-footer-buttons">
            <Link to={"/wishlists"}>
              <button type="button" className="wishlist-form-cancel-button">
                Cancel
              </button>
            </Link>
            <button type="submit" className="wishlist-form-save-button">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WishlistForm;
