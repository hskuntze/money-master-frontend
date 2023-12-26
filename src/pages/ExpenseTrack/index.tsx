import "./styles.css";
import PieChart from "components/PieChart";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "UserContext";
import { PieChartConfig } from "types/charts/piechartconfig";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "util/requests";
import { buildSumByTitle } from "util/helper";
import { TotalExpenseByMonth as TotalExpenseByMonthType } from "types/totalexpensebymonth";
import { getMonthNameFromDate } from "util/formatters";
import { toast } from "react-toastify";
import { SpringPage } from "types/springpage";
import TotalExpenseByMonth from "components/TotalExpenseByMonth";

const ExpenseTrackPage = () => {
  const [tebms, setTebms] = useState<SpringPage<TotalExpenseByMonthType>>();
  const [sumByTitles, setSumByTitles] = useState<PieChartConfig[]>([]);
  const { userContextData } = useContext(UserContext);

  const loadPieChartInfo = async (
    totalExpenseByMonth: TotalExpenseByMonthType
  ): Promise<void> => {
    const params: AxiosRequestConfig = {
      url: `/totalExpenseByMonths/sumByTitle/${totalExpenseByMonth.id}`,
      withCredentials: true,
      method: "GET",
    };

    try {
      const res = await requestBackend(params);
      const result = buildSumByTitle(
        res.data,
        getMonthNameFromDate(totalExpenseByMonth.date)
      );
      setSumByTitles((prev) => [...prev, result]);
    } catch (err) {
      console.log(err);
    }
  };

  const loadTebms = useCallback(() => {
    const params: AxiosRequestConfig = {
      url: "/totalExpenseByMonths/authenticated",
      withCredentials: true,
      method: "GET",
      params: {
        sort: "date",
        size: 900,
        sortExpenses: true,
        sortExpenseAttribute: "price",
      },
    };

    requestBackend(params)
      .then((res) => {
        setTebms(res.data);
      })
      .catch((err) => {
        toast.error(err);
      });
  }, []);

  useEffect(() => {
    if (userContextData.user?.expenseTrack !== undefined) {
      userContextData.user?.expenseTrack.totalExpenseByMonths.forEach(
        (tebm) => {
          loadPieChartInfo(tebm);
        }
      );
    }

    loadTebms();
  }, [userContextData, loadTebms]);

  return (
    <div className="expense-track-page-outter-container">
      <div className="expense-track-page-inner-container">
        {sumByTitles.map((sum, index) => (
          <div className="expense-track-item">
            <PieChart
              key={index}
              name={sum.name}
              labels={sum.labels}
              series={sum.series}
              width={50}
            />
            {tebms?.content
              .filter((tebm) => getMonthNameFromDate(tebm.date) === sum.name)
              .map((value) => (
                <TotalExpenseByMonth
                  id={value.id}
                  date={value.date}
                  title={getMonthNameFromDate(value.date)}
                  remainingAmount={value.remainingAmount}
                  variableExpenses={value.variableExpenses}
                  key={value.id}
                  width={50}
                  holdExpansion={false}
                />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseTrackPage;
