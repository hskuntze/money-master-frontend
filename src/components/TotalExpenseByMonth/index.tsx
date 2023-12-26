import { VariableExpense } from "types/variableexpense";
import "./styles.css";
import { formatNumberToMoney, formatStringToDate } from "util/formatters";

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
          id="tebm-inner-container"
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
        {holdExpansion && (
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
