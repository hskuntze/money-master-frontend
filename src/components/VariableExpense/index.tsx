import {
  formatNumberToMoney,
  formatStringToDate,
  getMonthNameFromDate,
} from "util/formatters";
import "./styles.css";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CurrencyInput } from "react-currency-mask";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "util/requests";
import { ReactComponent as Check } from "assets/images/check-circle.svg";
import { toast } from "react-toastify";

interface Props {
  id: number;
  title: string;
  price: number;
  dateOfCharge: string;
  onUpdate: () => void;
}

type FormData = {
  price: number;
  title: string;
  dateOfCharge: string;
};

const VariableExpense = ({ id, title, price, dateOfCharge, onUpdate }: Props) => {
  const [edit, setEdit] = useState(false);

  const {
    handleSubmit,
    control,
    setValue,
    register,
    formState: { errors },
  } = useForm<FormData>();

  const handleToggleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    setEdit(!edit);

    setValue("price", price);
    setValue("dateOfCharge", dateOfCharge);
    setValue("title", title);
  };

  const onSubmit = (formData: FormData) => {
    const params: AxiosRequestConfig = {
      url: `/totalExpenseByMonths/update/variableExpense/${id}`,
      withCredentials: true,
      method: "PUT",
      data: {
        price: formData.price,
        dateOfCharge: formData.dateOfCharge,
        title: formData.title,
      },
    };

    requestBackend(params)
      .then((res) => {
        onUpdate();
        setEdit(false);
        toast.success("Saved!");
      })
      .catch((err) => {
        toast.error("Unable to save. Try again later.");
      });
  };

  const handleDelete = () => {
    let result = window.confirm("Are you sure you want to delete it? You'll lose this record!");

    if(result) {
      const params: AxiosRequestConfig = {
        url: `/totalExpenseByMonths/delete/variableExpense/${id}`,
        withCredentials: true,
        method: "DELETE",
      };

      requestBackend(params)
        .then((res) => {
          onUpdate();
          toast.success("Deleted sucessfully");
        })
        .catch((err) => {
          toast.error("Unable to delete this record. Try again later.");
        })
    }
  };

  return (
    <div className="variable-expense-container">
      <div className="variable-expense-header-buttons">
        <button
          type="button"
          className="variable-expense-header-btt"
          onClick={handleToggleEdit}
        >
          <i className="bi bi-pencil-square" />
        </button>
        <button type="button" className="variable-expense-header-btt" onClick={handleDelete}>
          <i className="bi bi-trash-fill" />
        </button>
      </div>
      {edit ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="variable-expense-aux-div">
            <input
              type="text"
              id="variable-expense-title"
              placeholder="Title"
              className={`variable-expense-edit-input ${
                errors.title ? "is-invalid" : ""
              }`}
              {...register("title", {
                required: "Required",
              })}
            />
            <h4>-</h4>
            <input
              type="text"
              id="variable-expense-date-of-charge"
              placeholder="Date of Charge"
              className={`variable-expense-edit-input ${
                errors.dateOfCharge ? "is-invalid" : ""
              }`}
              {...register("dateOfCharge", {
                required: "Required",
              })}
            />
          </div>

          <div className="variable-expense-aux-div-2">
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  value={field.value}
                  onChangeValue={(_, value) => {
                    field.onChange(value);
                  }}
                  InputElement={
                    <input
                      type="text"
                      id="variable-expense-price"
                      placeholder=""
                      className="variable-expense-edit-input"
                    />
                  }
                />
              )}
            />
            <button type="submit" className="variable-expense-edit-save-button">
              <Check />
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="variable-expense-header">
            <span>{getMonthNameFromDate(dateOfCharge)}</span>
            <h4>
              {title} - {formatStringToDate(dateOfCharge)}
            </h4>
          </div>
          <div className="variable-expense-content">
            <span>{formatNumberToMoney(price)}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default VariableExpense;
