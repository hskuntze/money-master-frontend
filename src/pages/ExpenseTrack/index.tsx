import { Link, Route, Routes } from "react-router-dom";
import ExpenseTrackPage from "./ExpenseTrackPage";
import FormVariableExpense from "./FormVariableExpense";
import { useContext, useEffect, useState } from "react";
import FormFixedExpense from "./FormFixedExpense";
import { ThemeContext } from "ThemeContext";

const ExpenseTrack = () => {
  const [editFixedExpenses, setEditFixedExpenses] = useState(false);
  const [editVariableExpenses, setEditVariableExpenses] = useState(false);

  const { themeContextData } = useContext(ThemeContext);

  useEffect(() => {
    const element = document.getElementById(
      "expense-track"
    ) as HTMLDivElement;

    if (themeContextData.theme === "dark") {
      element.style.backgroundColor = "#073520";
    } else {
      element.style.backgroundColor = "#148C54";
    }
  }, [themeContextData.theme]);

  return (
    <section id="expense-track" className="expense-track-page-outter-container">
      <div
        className="manage-expenses-header"
        style={{ width: "calc( 96% + 10px )", margin: "0 auto" }}
      >
        <div className="manage-buttons meh-left">
          <Link to="/expensetrack">
            <button
              className="manage-button"
              onClick={() => {
                setEditFixedExpenses(!editFixedExpenses);
                setEditVariableExpenses(false);
              }}
            >
              Edit Fixed Expenses
            </button>
          </Link>
          <Link to="/expensetrack">
            <button
              className="manage-button"
              onClick={() => {
                setEditVariableExpenses(!editVariableExpenses);
                setEditFixedExpenses(false);
              }}
            >
              Edit Variable Expenses
            </button>
          </Link>
        </div>
        <div className="manage-buttons meh-right">
          <Link to="/expensetrack/add/fixedExpense">
            <button className="manage-button">Add Fixed Expense</button>
          </Link>
          <Link to="/expensetrack/add/variableExpense">
            <button className="manage-button">Add Variable Expense</button>
          </Link>
        </div>
      </div>
      <Routes>
        <Route
          path=""
          element={
            <ExpenseTrackPage
              editFixedExpenses={editFixedExpenses}
              editVariableExpenses={editVariableExpenses}
            />
          }
        />
        <Route path="add/variableExpense" element={<FormVariableExpense />} />
        <Route path="/add/fixedExpense" element={<FormFixedExpense />} />
      </Routes>
    </section>
  );
};

export default ExpenseTrack;
