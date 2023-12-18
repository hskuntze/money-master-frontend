import { useEffect, useState } from "react";
import "./styles.css";
import Loader from "components/Loader";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "util/requests";
import { toast } from "react-toastify";
import ExpenseTrack from "types/expensetrack";
import { formatNumberToMoney } from "util/formatters";

const MyInfo = () => {
  const [showInfo, setShowInfo] = useState(true);
  const [loading, setLoading] = useState(true);
  const [expenseTrack, setExpenseTrack] = useState<ExpenseTrack>();

  const salaryLabel = "My salary: ";
  const salaryPerYearLabel = "Salary per year: ";
  const paymentDayLabel = "Payment day: ";

  const handleToggleShowInfo = () => {
    setShowInfo(!showInfo);
  };

  const loadInfo = () => {
    const params: AxiosRequestConfig = {
      url: "/expenseTracks",
      withCredentials: true,
      method: "GET",
    };

    requestBackend(params)
      .then((res) => {
        setLoading(false);
        setExpenseTrack(res.data as ExpenseTrack);
      })
      .catch((err) => {
        toast.error(
          "Error while trying to retrieve your information. Please login again."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadInfo();
  }, []);

  return (
    <>
      {loading ? (
        <div className="my-info-outter-container box-shadow side-element">
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
              <button className="my-info-edit-button" type="button">
                <i className="bi bi-pencil-square" />
              </button>
            </div>
          </div>
          <Loader />
        </div>
      ) : (
        <div className="my-info-outter-container box-shadow side-element">
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
              <button className="my-info-edit-button" type="button">
                <i className="bi bi-pencil-square" />
              </button>
            </div>
          </div>
          {showInfo && expenseTrack ? (
            <div className="my-info-inner-container">
              <span>
                {salaryLabel} {formatNumberToMoney(expenseTrack.monthlyIncome)}
              </span>
              <span>
                {salaryPerYearLabel}{" "}
                {formatNumberToMoney(expenseTrack.anualIncome)}
              </span>
              <span>
                {paymentDayLabel} {expenseTrack.dayOfSalaryPayment}
              </span>
            </div>
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
      )}
    </>
  );
};

export default MyInfo;
