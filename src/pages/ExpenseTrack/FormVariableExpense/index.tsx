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
  price: number;
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
      price: 0,
      title: "",
    });
  };

  const handleDateChange = (date: Date | null, index: number) => {
    const newDate = [...dates];
    newDate[index] = date;
    setDates(newDate);
  };

  const onSubmit = (formData: FormData) => {
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
        console.log(res);
      })
      .catch((err) => {
        toast.error("Unable to saved these records.");
        console.log(err);
      });
  };

  return (
    <div className="variable-expense-form-container">
      <button type="button" onClick={handleIncreaseEntries}>
        <i className="bi bi-plus-circle-fill" />
      </button>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="select-month">
          <Controller
            name="month"
            control={control}
            render={({ field }) => (
              <select
                id="variable-expense-month-data"
                className={`variable-expense-select-month ${
                  errors.month ? "is-invalid" : ""
                }`}
                {...register("month", {
                  required: "Required",
                })}
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
        <div className="select-year">
          <Controller
            name="year"
            control={control}
            render={({ field }) => (
              <select
                id="variable-expense-year-data"
                className={`variable-expense-select-month ${
                  errors.year ? "is-invalid" : ""
                }`}
                {...register("year", {
                  required: "Required",
                })}
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
          <div className="invalid-feedback d-block">{errors.year?.message}</div>
        </div>
        {fields.map((field, index) => (
          <div key={field.id}>
            <div className="variable-expense-entry">
              <input
                type="text"
                {...register(`expenses.${index}.title`)}
                id="variable-expense-title"
                className={`register-expense-input ${
                  errors.expenses !== undefined && errors.expenses[index]?.title
                    ? "is-invalid"
                    : ""
                }`}
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
                        placeholder=""
                      />
                    }
                  />
                )}
              />
            </div>
            <div className="variable-expense-entry">
              <Controller
                name={`expenses.${index}.dateOfCharge`}
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
                    className="date-picker"
                  />
                )}
              />
            </div>
            <button type="button" onClick={() => remove(index)}>
              remove
            </button>
          </div>
        ))}
        <button
          id="variable-expense-save-button"
          className="variable-expense-save-button"
        >
          save
        </button>
      </form>
    </div>
  );
};

export default FormVariableExpense;
