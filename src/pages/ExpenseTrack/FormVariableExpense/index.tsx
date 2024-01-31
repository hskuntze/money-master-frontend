import "./styles.css";
import { CurrencyInput } from "react-currency-mask";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useState } from "react";
import { formatDate } from "util/formatters";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "util/requests";
import { toast } from "react-toastify";

type VariableExpenseEntryType = {
  title: string;
  price: number | undefined;
  dateOfCharge: string;
};

type FormData = {
  expenses: VariableExpenseEntryType[];
  month: number;
  year: number;
};

const FormVariableExpense = () => {
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

  const [dates, setDates] = useState<Array<Date | null>>([]);
  const [isYearSelected, setIsYearSelected] = useState(false);
  const [isMonthSelected, setIsMonthSelected] = useState(false);

  const monthOptions = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const yearOptions = [
    { value: 2023, label: "2023" },
    { value: 2024, label: "2024" },
  ];

  const handleIncreaseEntries = () => {
    append({
      dateOfCharge: "",
      price: undefined,
      title: "",
    });
  };

  const handleDateChange = (date: Date | null, index: number) => {
    const newDate = [...dates];
    newDate[index] = date;
    setDates(newDate);
  };

  const onSubmit = (formData: FormData) => {
    if (formData.expenses.length !== 0) {
      const params: AxiosRequestConfig = {
        url: "/totalExpenseByMonths/register/variableExpenses",
        withCredentials: true,
        method: "POST",
        params: {
          month: formData.month,
          year: formData.year,
        },
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
    <div className="variable-expense-form-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="variable-expense-form-containter-header">
          <div className="variable-expense-select-container">
            <Controller
              name="month"
              control={control}
              render={({ field }) => (
                <select
                  id="variable-expense-month-data"
                  className={`variable-expense-select ${
                    errors.month ? "is-invalid" : ""
                  }`}
                  {...register("month", {
                    required: "Required",
                  })}
                  onChange={() => setIsMonthSelected(true)}
                >
                  <option value="">Select a month to register</option>
                  {monthOptions.map((el) => (
                    <option value={el.value} key={el.value}>
                      {el.label}
                    </option>
                  ))}
                </select>
              )}
            />
            <div className="invalid-feedback d-block">
              {errors.month?.message}
            </div>
          </div>
          <div className="variable-expense-select-container">
            <Controller
              name="year"
              control={control}
              render={({ field }) => (
                <select
                  id="variable-expense-year-data"
                  className={`variable-expense-select ${
                    errors.year ? "is-invalid" : ""
                  }`}
                  {...register("year", {
                    required: "Required",
                  })}
                  onChange={() => setIsYearSelected(true)}
                >
                  <option value="">Select a year to register</option>
                  {yearOptions.map((el) => (
                    <option value={el.value} key={el.value}>
                      {el.label}
                    </option>
                  ))}
                </select>
              )}
            />
            <div className="invalid-feedback d-block">
              {errors.year?.message}
            </div>
          </div>
          {isYearSelected && isMonthSelected && (
            <button
              className="new-variable-expense-button"
              type="button"
              onClick={handleIncreaseEntries}
            >
              <i className="bi bi-plus-circle-fill" />
            </button>
          )}
        </div>
        <div className="variable-expense-form-content">
          {fields.map((field, index) => (
            <div className="variable-expense-entry-container" key={field.id}>
              <div className="variable-expense-entry">
                <input
                  type="text"
                  {...register(`expenses.${index}.title`, {
                    required: "Required",
                  })}
                  id="variable-expense-title"
                  className={`register-expense-input ${
                    errors.expenses !== undefined &&
                    errors.expenses[index]?.title
                      ? "is-invalid"
                      : ""
                  }`}
                  placeholder="Title"
                />
                <div className="invalid-feedback d-block">
                  {errors.expenses && errors.expenses[index]?.title?.message}
                </div>
              </div>
              <div className="variable-expense-entry">
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
                          id="variable-expense-price"
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
              <div className="variable-expense-entry">
                <Controller
                  {...register(`expenses.${index}.dateOfCharge`, {
                    required: "Required",
                  })}
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      selected={dates[index]}
                      onChange={(date) => handleDateChange(date, index)}
                      onSelect={(date) =>
                        setValue(
                          `expenses.${index}.dateOfCharge`,
                          formatDate(date)
                        )
                      }
                      dateFormat={"dd/MM/yyyy"}
                      className="register-expense-input date-picker"
                      placeholderText="Date of charge"
                    />
                  )}
                />
                <div className="invalid-feedback d-block">
                  {errors.expenses &&
                    errors.expenses[index]?.dateOfCharge?.message}
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
          id="variable-expense-save-button"
          className="variable-expense-save-button"
          type="submit"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default FormVariableExpense;
