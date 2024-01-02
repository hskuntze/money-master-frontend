import "./styles.css";
import { useCallback, useEffect, useState } from "react";
import { FixedExpense } from "types/fixedexpense";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "util/requests";
import { toast } from "react-toastify";
import { SpringPage } from "types/springpage";
import Pagination from "components/Pagination";
import { formatNumberToMoney } from "util/formatters";

type HpfeContentData = {
  activePage: number;
};

const HomePageFixedExpense = () => {
  const [fixedExpenses, setFixedExpenses] =
    useState<SpringPage<FixedExpense>>();
  const [hpfeContentData, setHpfeContentData] = useState<HpfeContentData>({
    activePage: 0,
  });

  const loadInfo = useCallback(() => {
    const params: AxiosRequestConfig = {
      url: "/totalExpenseByMonths/findAll/fixedExpenses/validdate",
      method: "GET",
      withCredentials: true,
      params: {
        size: 5,
        page: hpfeContentData.activePage,
        sort: "price,desc"
      },
    };

    requestBackend(params)
      .then((res) => {
        setFixedExpenses(res.data);
      })
      .catch((err) => {
        toast.error(err);
      });
  }, [hpfeContentData]);

  useEffect(() => {
    loadInfo();
  }, [loadInfo]);

  const handlePageChange = (pageNumber: number) => {
    setHpfeContentData({
      activePage: pageNumber,
    });
  };

  return (
    <div className="hpfe-outter-container">
      <div className="hpfe-header">
        <span>Your fixed expenses this month</span>
      </div>
      <div className="hpfe-inner-container">
        {fixedExpenses?.content.map((fe) => (
          <div className="hpfe-item" key={fe.title}>
            <span>{fe.title}</span>
            <span>{formatNumberToMoney(fe.price)}</span>
            <span>Day of Charge: {fe.dayOfCharge}</span>
          </div>
        ))}
      </div>
      <div className="hpfe-pagination-container">
        <Pagination
          pageCount={fixedExpenses ? fixedExpenses.totalPages : 0}
          range={2}
          width={200}
          forcePage={fixedExpenses?.number}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default HomePageFixedExpense;
