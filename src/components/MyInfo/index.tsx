import { useEffect, useState } from "react";
import "./styles.css";
import Loader from "components/Loader";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "util/requests";
import { toast } from "react-toastify";
import ExpenseTrack from "types/expensetrack";

const MyInfo = () => {
  const [showInfo, setShowInfo] = useState(true);
  const [loading, setLoading] = useState(true);
  const [expenseTrack, setExpenseTrack] = useState<ExpenseTrack>();

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
        toast.error("Error while trying to retrieve your information");
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    loadInfo();
  }, []);

  return (
    <>
      {loading ? (
        <div className="my-info-outter-container">
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
        <div className="my-info-outter-container">
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
          {showInfo ? (
            <div className="my-info-inner-container">
              <span>My salary: R$ {expenseTrack?.monthlyIncome}</span>
              <span>Salary per year: R$ {expenseTrack?.anualIncome}</span>
              <span>Day of payment: {expenseTrack?.dayOfSalaryPayment}</span>
            </div>
          ) : (
            <div className="my-info-inner-container">
              <span>
                My salary: R$ <i className="bi bi-three-dots" />
              </span>
              <span>
                Salary per year: R$ <i className="bi bi-three-dots" />
              </span>
              <span>
                Day of payment: <i className="bi bi-three-dots" />
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default MyInfo;
