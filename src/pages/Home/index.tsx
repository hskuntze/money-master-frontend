import "./styles.css";
import { AxiosRequestConfig } from "axios";
import MyInfo from "components/MyInfo";
import Vault from "components/Vault";
import Wishlists from "components/Wishlists";
import { requestBackend } from "util/requests";
import { useCallback, useEffect, useState } from "react";
import { TotalExpenseByMonth as TotalExpenseByMonthType } from "types/totalexpensebymonth";
import { SpringPage } from "types/springpage";
import { toast } from "react-toastify";
import TotalExpenseByMonth from "components/TotalExpenseByMonth";
import { getMonthNameFromDate } from "util/formatters";
import Pagination from "components/Pagination";
import HomePageFixedExpense from "components/HomePageFixedExpense";

type TebmComponentData = {
  activePage: number;
};

const Home = () => {
  const [tebms, setTebms] = useState<SpringPage<TotalExpenseByMonthType>>();
  const [tebmComponentData, setTebmComponentData] = useState<TebmComponentData>(
    {
      activePage: 0,
    }
  );

  /**
   * Responsible for loading the TotalExpenseByMonth's
   */
  const loadTebms = useCallback(() => {
    const params: AxiosRequestConfig = {
      url: "/totalExpenseByMonths/authenticated",
      withCredentials: true,
      method: "GET",
      params: {
        sort: "date",
        size: 3,
        sortExpenses: true,
        sortExpenseAttribute: "price",
        page: tebmComponentData.activePage,
      },
    };

    requestBackend(params)
      .then((res) => {
        setTebms(res.data);
      })
      .catch((err) => {
        toast.error(err);
      });
  }, [tebmComponentData]);

  useEffect(() => {
    loadTebms();
  }, [loadTebms]);

  const handlePageChange = (pageNumber: number) => {
    setTebmComponentData({
      activePage: pageNumber,
    });
  };

  return (
    <>
      <section id="main-section" className="main-section">
        <div className="main-content">
          <div className="hpfe-container">
            <div className="hpfe-content">
              <HomePageFixedExpense />
            </div>
          </div>
          <div className="tebm-container">
            <div className="tebm-content">
              {tebms?.content.map((tebm) => (
                <TotalExpenseByMonth
                  key={tebm.id}
                  id={tebm.id}
                  date={tebm.date}
                  remainingAmount={tebm.remainingAmount}
                  title={getMonthNameFromDate(tebm.date)}
                  variableExpenses={tebm.variableExpenses.reverse()}
                  width={30}
                  holdExpansion={true}
                />
              ))}
            </div>
            <Pagination
              pageCount={tebms ? tebms.totalPages : 0}
              forcePage={tebms?.number}
              range={2}
              onChange={handlePageChange}
              width={300}
            />
          </div>
        </div>
      </section>
      <aside id="side-section" className="side-section">
        <MyInfo />
        <Vault />
        <Wishlists />
      </aside>
    </>
  );
};

export default Home;
