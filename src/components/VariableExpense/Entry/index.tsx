import "./styles.css";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CurrencyInput } from "react-currency-mask";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type FormData = {
  month: number;
  year: number;
  price: number;
  title: string;
  dateOfCharge: string;
};

const VariableExpenseEntry = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<FormData>();

  const [startDate, setStartDate] = useState(new Date());

  const yearOptions = [
    { value: 2023, label: "2023" },
    { value: 2024, label: "2024" },
  ];

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

  return (
    <>
      <div className="variable-expense-data">
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
        </div>
      </div>
      <div className="variable-expense-entry">
        <input
          type="text"
          id="variable-expense-title"
          className={`register-expense-input ${
            errors.title ? "is-invalid" : ""
          }`}
          {...register("title", {
            required: "Required",
          })}
        />
        <div className="invalid-feedback d-block">{errors.title?.message}</div>
      </div>
      <div className="variable-expense-entry">
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
                <input type="text" id="variable-expense-price" placeholder="" />
              }
            />
          )}
        />
      </div>
      <div className="variable-expense-entry">
        <Controller
          name="dateOfCharge"
          control={control}
          render={({ field }) => (
            <DatePicker
              selected={startDate}
              onChange={(date) =>
                date !== null && field.onChange(setStartDate(date))
              }
              dateFormat={"yyyy-MM-dd"}
              className="date-picker"
            />
          )}
        />
      </div>
    </>
  );
};

export default VariableExpenseEntry;
