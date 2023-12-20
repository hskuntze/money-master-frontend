import "./styles.css";
import { useContext, useState } from "react";
import { formatNumberToMoney } from "util/formatters";
import { UserContext } from "UserContext";

const MyInfo = () => {
  const { userContextData } = useContext(UserContext);
  const [showInfo, setShowInfo] = useState(true);

  const salaryLabel = "My salary: ";
  const salaryPerYearLabel = "Salary per year: ";
  const paymentDayLabel = "Payment day: ";

  const handleToggleShowInfo = () => {
    setShowInfo(!showInfo);
  };

  return (
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
      {showInfo && userContextData.user?.expenseTrack ? (
        <div className="my-info-inner-container">
          <span>
            {salaryLabel}{" "}
            {formatNumberToMoney(
              userContextData.user.expenseTrack.monthlyIncome
            )}
          </span>
          <span>
            {salaryPerYearLabel}{" "}
            {formatNumberToMoney(userContextData.user.expenseTrack.anualIncome)}
          </span>
          <span>
            {paymentDayLabel}{" "}
            {userContextData.user.expenseTrack.dayOfSalaryPayment}
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
  );
};

export default MyInfo;
