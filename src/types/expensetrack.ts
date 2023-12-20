import { TotalExpenseByMonth } from "./totalexpensebymonth";

type ExpenseTrack = {
  monthlyIncome: number;
  anualIncome: number;
  extraIncome: number;
  dayOfSalaryPayment: number;
  fluctuationByMonth: number;
  totalExpenseByMonths: TotalExpenseByMonth[];
};

export default ExpenseTrack;