import { VariableExpense } from "types/variableexpense";
import "./styles.css";
import { formatNumberToMoney, formatStringToDate } from "util/formatters";
import { useEffect, useState } from "react";

interface Props {
  id: number;
  title: string;
  date: string;
  remainingAmount: number;
  variableExpenses: VariableExpense[];
}

const TotalExpenseByMonth = ({
  id,
  date,
  title,
  remainingAmount,
  variableExpenses,
}: Props) => {
  const [showMoreMessage, setShowMoreMessage] = useState(false);

  const shouldShowMoreMessage = () => {
    const innerContainer = document.getElementById(
      "tebm-inner-container"
    ) as HTMLDivElement;

    if (innerContainer.clientHeight < innerContainer.scrollHeight) {
      setShowMoreMessage(true);
    }
  };

  useEffect(() => {
    if (!showMoreMessage) {
      shouldShowMoreMessage();
    }
  }, [showMoreMessage, title]);

  return (
    <div id={`tebm-${id}`} className="tebm-outter-container">
      <div className="tebm-header">
        <span className="tebm-title">Total Expense - {title}</span>
        <span className="tebm-subtitle">
          You had {variableExpenses.length} variable expenses this month
        </span>
      </div>
      <div id="tebm-inner-container" className="tebm-inner-container">
        {variableExpenses.map((ve) => (
          <div className="tebm-variable-expense" key={ve.id}>
            <span>
              [{formatStringToDate(ve.dateOfCharge)}] {ve.title}, {formatNumberToMoney(ve.price)}
            </span>
          </div>
        ))}
      </div>
      {showMoreMessage && <span className="show-more-message">...and more</span>}
      <div className="tebm-footer">
        <span>Remaining amount: {formatNumberToMoney(remainingAmount)}</span>
        <span>{formatStringToDate(date)}</span>
      </div>
    </div>
  );
};

export default TotalExpenseByMonth;
