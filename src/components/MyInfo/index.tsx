import "./styles.css";
import { useContext, useEffect, useState } from "react";
import { formatNumberToMoney } from "util/formatters";
import { UserContext } from "UserContext";
import { Controller, useForm } from "react-hook-form";
import { CurrencyInput } from "react-currency-mask";
import { AxiosRequestConfig } from "axios";
import { toast } from "react-toastify";
import { requestBackend } from "util/requests";
import { getUserData, removeUserData, saveUserData } from "util/storage";
import { ThemeContext } from "ThemeContext";

type FormData = {
  salary: number;
};

const MyInfo = () => {
  const salaryLabel = "My salary: ";
  const salaryPerYearLabel = "Salary per year: ";
  const paymentDayLabel = "Payment day: ";

  const [showInfo, setShowInfo] = useState(true);
  const [edit, setEdit] = useState(false);
  const { handleSubmit, control, setValue } = useForm<FormData>();
  const { userContextData, setUserContextData } = useContext(UserContext);
  const { themeContextData } = useContext(ThemeContext);

  const handleToggleShowInfo = () => {
    setShowInfo(!showInfo);
  };

  const handleEdit = () => {
    setEdit(!edit);
    if (userContextData.user?.expenseTrack !== undefined) {
      setValue("salary", userContextData.user.expenseTrack.monthlyIncome);
    } else {
      toast.error("User data is undefined. Try logging in again.");
    }
  };

  const onSubmit = (formData: FormData) => {
    const params: AxiosRequestConfig = {
      url: "/expenseTracks/update/salaryIncome",
      withCredentials: true,
      method: "PUT",
      params: {
        value: formData.salary,
      },
    };

    requestBackend(params)
      .then((res) => {
        const user = getUserData();
        removeUserData();
        user.expenseTrack = res.data;
        saveUserData(user);
        setUserContextData({
          user: user,
        });
        toast.success("Saved");
      })
      .catch((err) => {
        if (err.response !== undefined) {
          toast.error(err.response.data.message);
        } else {
          toast.error(err);
        }
      });
  };

  useEffect(() => {
    const element = document.getElementById(
      "my-info-element"
    ) as HTMLDivElement;

    if (themeContextData.theme === "dark") {
      element.style.backgroundColor = "#073520";
    } else {
      element.style.backgroundColor = "#148C54";
    }
  }, [themeContextData.theme]);

  return (
    <div
      id="my-info-element"
      className="my-info-outter-container box-shadow side-element"
    >
      <div className="my-info-header">
        <span className="my-info-title">My Info</span>
        <div className="my-info-button-display">
          <button
            className="my-info-show-info-button"
            type="button"
            onClick={handleToggleShowInfo}
          >
            {showInfo ? (
              <i className="bi bi-eye-slash-fill" />
            ) : (
              <i className="bi bi-eye-fill" />
            )}
          </button>
          <button
            className="my-info-edit-button"
            type="button"
            onClick={handleEdit}
          >
            <i className="bi bi-pencil-square" />
          </button>
        </div>
      </div>
      {showInfo && userContextData.user?.expenseTrack ? (
        <>
          {edit ? (
            <div className="my-info-inner-container">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="my-info-edit-field">
                  <span>{salaryLabel}</span>
                  <Controller
                    name="salary"
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
                            id="my-info-edit-salary"
                            placeholder=""
                          />
                        }
                      />
                    )}
                  />
                  <button type="submit" className="my-info-edit-field-button">
                    <i className="bi bi-check-circle-fill" />
                  </button>
                </div>
              </form>
              <span>
                {salaryPerYearLabel}{" "}
                {formatNumberToMoney(
                  userContextData.user.expenseTrack.anualIncome
                )}
              </span>
              <span>
                {paymentDayLabel}{" "}
                {userContextData.user.expenseTrack.dayOfSalaryPayment}
              </span>
            </div>
          ) : (
            <div className="my-info-inner-container">
              <span>
                {salaryLabel}{" "}
                {formatNumberToMoney(
                  userContextData.user.expenseTrack.monthlyIncome
                )}
              </span>
              <span>
                {salaryPerYearLabel}{" "}
                {formatNumberToMoney(
                  userContextData.user.expenseTrack.anualIncome
                )}
              </span>
              <span>
                {paymentDayLabel}{" "}
                {userContextData.user.expenseTrack.dayOfSalaryPayment}
              </span>
            </div>
          )}
        </>
      ) : (
        <div className="my-info-inner-container">
          <span>
            {salaryLabel} R$ <i className="bi bi-three-dots" />
          </span>
          <span>
            {salaryPerYearLabel} R$ <i className="bi bi-three-dots" />
          </span>
          <span>
            {paymentDayLabel} <i className="bi bi-three-dots" />
          </span>
        </div>
      )}
    </div>
  );
};

export default MyInfo;
