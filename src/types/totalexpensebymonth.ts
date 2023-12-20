import { FixedExpense } from "./fixedexpense";
import { VariableExpense } from "./variableexpense";

export type TotalExpenseByMonth = {
  id: number;
  date: string;
  totalExpended: number;
  remainingAmount: number;
  variableExpenses: VariableExpense[];
  fixedExpenses: FixedExpense[];
};
