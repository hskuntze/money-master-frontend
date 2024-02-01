import "./styles.css";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { CurrencyInput } from "react-currency-mask";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatDateToString } from "util/formatters";
import { useState } from "react";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "util/requests";
import { toast } from "react-toastify";

type FixedExpenseEntryType = {
  title: string;
  price: number | undefined;
  dayOfCharge: number | undefined;
  beginOfExpense: string;
  endOfExpense: string;
};

type FormData = {
  expenses: FixedExpenseEntryType[];
};

const FormFixedExpense = () => {
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    setValue,
  } = useForm<FormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "expenses",
  });

  const [beginDates, setBeginDates] = useState<Array<Date | null>>([]);
  const [endDates, setEndDates] = useState<Array<Date | null>>([]);

  const handleIncreaseEntries = () => {
    append({
      dayOfCharge: undefined,
      price: undefined,
      title: "",
      beginOfExpense: "",
      endOfExpense: "",
    });
  };

  const handleBeginDatesChange = (date: Date | null, index: number) => {
    const newDate = [...beginDates];
    newDate[index] = date;
    setBeginDates(newDate);
  };

  const handleEndDatesChange = (date: Date | null, index: number) => {
    const newDate = [...endDates];
    newDate[index] = date;
    setEndDates(newDate);
  };

  const onSubmit = (formData: FormData) => {
    if (formData.expenses.length !== 0) {
      const params: AxiosRequestConfig = {
        url: "/totalExpenseByMonths/register/fixedExpenses",
        withCredentials: true,
        method: "POST",
        data: formData.expenses,
      };

      requestBackend(params)
        .then((res) => {
          toast.success("Saved!");
        })
        .catch((err) => {
          toast.error("Unable to save these records.");
        });
    } else {
      toast.warning("First you need to create at least 1 new variable expense");
    }
  };

  return (
    <div className="fixed-expense-form-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="fixed-expense-form-container-header">
          <button
            className="new-fixed-expense-button"
            type="button"
            onClick={handleIncreaseEntries}
          >
            <i className="bi bi-plus-circle-fill" />
          </button>
        </div>
        <div className="fixed-expense-form-content">
          {fields.map((field, index) => (
            <div className="fixed-expense-entry-container" key={field.id}>
              <div className="fixed-expense-entry">
                <input
                  type="text"
                  placeholder="Title"
                  id="fixed-expense-title"
                  className={`register-expense-input ${
                    errors.expenses !== undefined &&
                    errors.expenses[index]?.title
                      ? "is-invalid"
                      : ""
                  }`}
                  {...register(`expenses.${index}.title`, {
                    required: "Required",
                  })}
                />
                <div className="invalid-feedback d-block">
                  {errors.expenses && errors.expenses[index]?.title?.message}
                </div>
              </div>
              <div className="fixed-expense-entry">
                <Controller
                  name={`expenses.${index}.price`}
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
                          id="fixed-expense-price"
                          placeholder="Price"
                          className={`register-expense-input ${
                            errors.expenses !== undefined &&
                            errors.expenses[index]?.price
                              ? "is-invalid"
                              : ""
                          }`}
                          {...register(`expenses.${index}.price`, {
                            required: "Required",
                          })}
                        />
                      }
                    />
                  )}
                />

                <div className="invalid-feedback d-block">
                  {errors.expenses && errors.expenses[index]?.price?.message}
                </div>
              </div>
              <div className="fixed-expense-entry">
                <input
                  type="number"
                  id="fixed-expense-day-of-charge"
                  placeholder="Day of charge"
                  max={31}
                  min={1}
                  className={`register-expense-input ${
                    errors.expenses !== undefined &&
                    errors.expenses[index]?.dayOfCharge
                      ? "is-invalid"
                      : ""
                  }`}
                  {...register(`expenses.${index}.dayOfCharge`, {
                    required: "Required. Must be between 1 and 31",
                    min: 1,
                    max: 31,
                  })}
                />
                <div className="invalid-feedback d-block">
                  {errors.expenses &&
                    errors.expenses[index]?.dayOfCharge?.message}
                </div>
              </div>
              <div className="fixed-expense-entry">
                <Controller
                  {...register(`expenses.${index}.beginOfExpense`, {
                    required: "Required",
                  })}
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      selected={beginDates[index]}
                      onChange={(date) => handleBeginDatesChange(date, index)}
                      onSelect={(date) =>
                        setValue(
                          `expenses.${index}.beginOfExpense`,
                          formatDateToString(date)
                        )
                      }
                      dateFormat={"dd/MM/yyyy"}
                      className="register-expense-input date-picker"
                      placeholderText="Begin of expense charge date"
                    />
                  )}
                />
                <div className="invalid-feedback d-block">
                  {errors.expenses &&
                    errors.expenses[index]?.beginOfExpense?.message}
                </div>
              </div>
              <div className="fixed-expense-entry">
                <Controller
                  {...register(`expenses.${index}.endOfExpense`, {
                    required: "Required",
                  })}
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      selected={endDates[index]}
                      onChange={(date) => handleEndDatesChange(date, index)}
                      onSelect={(date) =>
                        setValue(
                          `expenses.${index}.endOfExpense`,
                          formatDateToString(date)
                        )
                      }
                      dateFormat={"dd/MM/yyyy"}
                      className="register-expense-input date-picker"
                      placeholderText="End of expense charge date"
                    />
                  )}
                />
                <div className="invalid-feedback d-block">
                  {errors.expenses &&
                    errors.expenses[index]?.endOfExpense?.message}
                </div>
              </div>
              <button
                className="variable-expense-remove-button"
                type="button"
                onClick={() => remove(index)}
              >
                <i className="bi bi-dash-circle-fill" />
              </button>
            </div>
          ))}
        </div>
        <button
          id="fixed-expense-save-button"
          className="fixed-expense-save-button"
          type="submit"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default FormFixedExpense;
