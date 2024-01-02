import "./styles.css";
import PieChart from "components/PieChart";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "UserContext";
import { PieChartConfig } from "types/charts/piechartconfig";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "util/requests";
import {
  buildBasicTebmData,
  buildSumByDate,
  buildSumByTitle,
} from "util/helper";
import { TotalExpenseByMonth as TotalExpenseByMonthType } from "types/totalexpensebymonth";
import { getMonthNameFromDate } from "util/formatters";
import { toast } from "react-toastify";
import { SpringPage } from "types/springpage";
import TotalExpenseByMonth from "components/TotalExpenseByMonth";
import ColumnChart from "components/ColumnChart";
import { ColumnChartConfig } from "types/charts/columnchartconfig";

const ExpenseTrackPage = () => {
  const [tebms, setTebms] = useState<SpringPage<TotalExpenseByMonthType>>();
  const [basicTebms, setBasicTebms] = useState<ColumnChartConfig[]>([]);
  const [sumByTitles, setSumByTitles] = useState<PieChartConfig[]>([]);
  const [sumByDate, setSumByDate] = useState<ColumnChartConfig[]>([]);
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

  const loadColumnChartInfo = async (
    totalExpenseByMonth: TotalExpenseByMonthType
  ): Promise<void> => {
    const params: AxiosRequestConfig = {
      url: `/totalExpenseByMonths/sumByDate/${totalExpenseByMonth.id}`,
      withCredentials: true,
      method: "GET",
    };

    try {
      const res = await requestBackend(params);
      const result = buildSumByDate(res.data) as ColumnChartConfig[];
      setSumByDate((prev) => [...prev, ...result]);
    } catch (err) {
      console.log(err);
    }
  };

  const loadBasicDataColumnChartInfo = async (): Promise<void> => {
    const params: AxiosRequestConfig = {
      url: "/totalExpenseByMonths/basicDataFromAll",
      withCredentials: true,
      method: "GET",
    };

    try {
      const res = await requestBackend(params);
      const result = buildBasicTebmData(res.data) as ColumnChartConfig[];
      setBasicTebms(result);
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
    loadTebms();

    if (userContextData.user?.expenseTrack !== undefined) {
      userContextData.user?.expenseTrack.totalExpenseByMonths.forEach(
        (tebm) => {
          loadPieChartInfo(tebm);
          loadColumnChartInfo(tebm);
        }
      );

      loadBasicDataColumnChartInfo();
    }
  }, [userContextData, loadTebms]);

  return (
    <div className="expense-track-page-outter-container">
      <div className="expense-track-header">
        <ColumnChart
          name="Expenses by date of charge"
          series={sumByDate}
          width={48}
          type="datetime"
          key={"variable-expenses-by-date-chart"}
        />
        <ColumnChart
          name="Total expenses by month"
          series={basicTebms}
          width={48}
          type="category"
          key={"total-expenses-by-month-chart"}
        />
      </div>
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
