import { VariableExpense } from "types/variableexpense";
import "./styles.css";
import { formatNumberToMoney, formatStringToDate } from "util/formatters";
import { useCallback, useEffect, useState } from "react";

interface Props {
  id: number;
  title: string;
  date: string;
  remainingAmount: number;
  variableExpenses: VariableExpense[];
  width: number;
  holdExpansion: boolean;
}

const TotalExpenseByMonth = ({
  id,
  date,
  title,
  remainingAmount,
  variableExpenses,
  width,
  holdExpansion,
}: Props) => {
  const [showMoreMessage, setShowMoreMessage] = useState(false);

  const shouldShowMoreMessage = useCallback(() => {
    const innerContainer = document.getElementById(
      `tebm-inner-container-${id}`
    ) as HTMLDivElement;

    if (innerContainer.clientWidth > 0) {
      setShowMoreMessage(true);
    }
  }, [id]);

  useEffect(() => {
    if (!showMoreMessage) {
      shouldShowMoreMessage();
    }
  }, [showMoreMessage, shouldShowMoreMessage]);

  return (
    <div
      id={`tebm-${id}`}
      className="tebm-outter-container"
      style={{ width: width + "%", maxWidth: width + "%" }}
    >
      <div className="tebm-content">
        <div className="tebm-header">
          <span className="tebm-title">Total Expense - {title}</span>
          <span className="tebm-subtitle">
            You had {variableExpenses.length} variable expenses this month
          </span>
        </div>
        <div
          id={`tebm-inner-container-${id}`}
          className={
            holdExpansion
              ? "tebm-inner-container hold-expansion"
              : "tebm-inner-container dont-hold-expansion"
          }
        >
          {variableExpenses.map((ve) => (
            <div className="tebm-variable-expense" key={ve.id}>
              <span>
                [{formatStringToDate(ve.dateOfCharge)}] {ve.title},{" "}
                {formatNumberToMoney(ve.price)}
              </span>
            </div>
          ))}
        </div>
        {holdExpansion && showMoreMessage && (
          <span className="show-more-message">...and more</span>
        )}
        <div className="tebm-footer">
          <span>Remaining amount: {formatNumberToMoney(remainingAmount)}</span>
          <span>{formatStringToDate(date)}</span>
        </div>
      </div>
    </div>
  );
};

export default TotalExpenseByMonth;
