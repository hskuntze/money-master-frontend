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
import VariableExpense from "components/VariableExpense";
import { VariableExpense as VariableExpenseType } from "types/variableexpense";
import FixedExpenses from "components/FixedExpenses";

type GroupedExpenses = { [key: string]: VariableExpenseType[] };

interface Props {
  editFixedExpenses: boolean;
  editVariableExpenses: boolean;
}

const ExpenseTrackPage = ({
  editFixedExpenses,
  editVariableExpenses,
}: Props) => {
  const [tebms, setTebms] = useState<SpringPage<TotalExpenseByMonthType>>();
  const [basicTebms, setBasicTebms] = useState<ColumnChartConfig[]>([]);
  const [sumByTitles, setSumByTitles] = useState<PieChartConfig[]>([]);
  const [sumByDate, setSumByDate] = useState<ColumnChartConfig[]>([]);

  const [groupedVariableExpenses, setGroupedVariableExpenses] =
    useState<GroupedExpenses>({});

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
      toast.error("Unable to load one or more chart data.");
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
      toast.error("Unable to load one or more chart data.");
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
      toast.error("Unable to load one or more chart data.");
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

        let groups: GroupedExpenses[] = [];
        let tebms: SpringPage<TotalExpenseByMonthType> = res.data;
        tebms?.content.forEach((tebm) => {
          groups.push(
            groupVariableExpensesByMonthAndYear(tebm.variableExpenses)
          );
        });

        const grouped: GroupedExpenses = groups.reduce((result, group) => {
          for (const key in group) {
            result[key] = result[key] || [];
            result[key] = result[key].concat(group[key]);
          }
          return result;
        }, {} as GroupedExpenses);

        setGroupedVariableExpenses(grouped);
      })
      .catch((err) => {
        toast.error(err);
      });
  }, []);

  const handleVariableExpenseUpdate = () => {
    loadTebms();
  };

  function groupVariableExpensesByMonthAndYear(
    expenses: VariableExpenseType[]
  ): GroupedExpenses {
    return expenses.reduce((groups, expense) => {
      const dateKey = expense.dateOfCharge.slice(0, 7);
      /**
       * acessa a posição [dateKey] e verifica se já existe como uma chave em groups, ela retorna o valor associado a essa chave (que é esperado ser um array).
       * operador de coalescência nula (||) é usado para fornecer um valor padrão caso a expressão à esquerda seja falsa ou undefined.
       * neste caso, se groups[dateKey] não existir (avaliado como falso), a expressão [] (um array vazio) será usada como valor padrão.
       */
      groups[dateKey] = groups[dateKey] || [];
      //adiciona o valor em [dateKey]
      groups[dateKey].push(expense);
      return groups;
    }, {} as GroupedExpenses);
  }

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
    <div>
      {editFixedExpenses && !editVariableExpenses && (
        <section className="edit-expenses-section fixed-expenses-section">
          <FixedExpenses editable={true} width={"calc( 96% + 10px )"} />
        </section>
      )}
      {!editFixedExpenses && editVariableExpenses && (
        <section className="edit-expenses-section">
          {Object.entries(groupedVariableExpenses).length !== 0 ? (
            <div className="edit-variable-expenses-section">
              {
                /**
                 * Transforma o objeto "groupedVariableExpenses" em um array com chave-valor e faz o mapping desses valores.
                 * Cada chave carrega como valor um array de objetos "VariableExpense".
                 */
                Object.entries(groupedVariableExpenses).map(
                  ([key, expense]) => (
                    <div
                      className="edit-variable-expense-group-container"
                      key={key}
                    >
                      <h2>
                        {getMonthNameFromDate(key)} - {key.slice(0, 4)}
                      </h2>
                      <div className="edit-variable-expense-group">
                        {expense.map((ve) => (
                          <VariableExpense
                            key={ve.id}
                            dateOfCharge={ve.dateOfCharge}
                            id={ve.id}
                            price={ve.price}
                            title={ve.title}
                            onUpdate={handleVariableExpenseUpdate}
                          />
                        ))}
                      </div>
                    </div>
                  )
                )
              }
            </div>
          ) : (
            <div className="nothing-to-show ve-nts-outter-container general-outter-container">
              Nothing to show here. Add some variable expenses.
            </div>
          )}
        </section>
      )}
      {!editFixedExpenses && !editVariableExpenses && (
        <>
          <div className="expense-track-header">
            <div className="expense-track-header-charts">
              <ColumnChart
                name="Expenses by date of charge"
                series={sumByDate}
                width={48}
                type="datetime"
              />
              <ColumnChart
                name="Total expenses by month"
                series={basicTebms}
                width={48}
                type="category"
              />
            </div>
          </div>
          <div className="expense-track-page-inner-container">
            {sumByTitles.map((sum, index) => (
              <div className="expense-track-item" key={sum.name + index}>
                <PieChart
                  name={sum.name}
                  labels={sum.labels}
                  series={sum.series}
                  width={50}
                  margin="0 0"
                  bottomRightBorder={0}
                  topRightBorder={0}
                  bottomLeftBorder={4}
                  topLeftBorder={4}
                />
                {tebms?.content
                  .filter(
                    (tebm) => getMonthNameFromDate(tebm.date) === sum.name
                  )
                  .map((value) => (
                    <TotalExpenseByMonth
                      key={value.date + value.id}
                      id={value.id}
                      date={value.date}
                      title={getMonthNameFromDate(value.date)}
                      remainingAmount={value.remainingAmount}
                      variableExpenses={value.variableExpenses}
                      width={50}
                      holdExpansion={false}
                      margin="0 0"
                      bottomLeftBorder={0}
                      topLeftBorder={0}
                    />
                  ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ExpenseTrackPage;
