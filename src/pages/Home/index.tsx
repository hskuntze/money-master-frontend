import "./styles.css";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "util/requests";
import { useCallback, useContext, useEffect, useState } from "react";
import { SpringPage } from "types/springpage";
import { toast } from "react-toastify";
import { getMonthNameFromDate } from "util/formatters";
import { useNavigate } from "react-router-dom";
import { getTokenData } from "util/auth";
import { ThemeContext } from "ThemeContext";

import { TotalExpenseByMonth as TotalExpenseByMonthType } from "types/totalexpensebymonth";

import MyInfo from "components/MyInfo";
import Vault from "components/Vault";
import TotalExpenseByMonth from "components/TotalExpenseByMonth";
import Pagination from "components/Pagination";
import FixedExpenses from "components/FixedExpenses";

import WishlistList from "pages/Wishlists/WishlistList";

type TebmComponentData = {
  activePage: number;
};

const Home = () => {
  const navigate = useNavigate();
  const [tebms, setTebms] = useState<SpringPage<TotalExpenseByMonthType>>();
  const [tebmComponentData, setTebmComponentData] = useState<TebmComponentData>(
    {
      activePage: 0,
    }
  );

  const { themeContextData } = useContext(ThemeContext);

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

  const handleTebmCreation = () => {
    const params: AxiosRequestConfig = {
      url: "/expenseTracks/register/totalExpenseForThisMonth",
      method: "POST",
      withCredentials: true,
    };

    requestBackend(params)
      .then(() => {
        toast.success("Success!");
      })
      .catch((err) => {
        if(err.response.data !== undefined) {
          toast.error(err.response.data.message);
        } else {
          toast.error("Unable to create a new TEBM");
        }
      });
  };

  useEffect(() => {
    if (getTokenData() === undefined) {
      navigate("/auth");
    }

    loadTebms();
  }, [loadTebms, navigate]);

  useEffect(() => {
    const element = document.getElementById("main-content") as HTMLDivElement;

    if (themeContextData.theme === "dark") {
      element.style.backgroundColor = "#073520";
    } else {
      element.style.backgroundColor = "#148C54";
    }
  }, [themeContextData.theme]);

  const handlePageChange = (pageNumber: number) => {
    setTebmComponentData({
      activePage: pageNumber,
    });
  };

  return (
    <>
      <section id="main-section" className="main-section">
        <div id="main-content" className="main-content">
          <div className="hpfe-container">
            <div className="hpfe-content">
              <FixedExpenses editable={false} />
            </div>
          </div>
          <div className="create-new-total-expense-by-month">
            <button
              className="new-total-expense-by-month-button"
              onClick={() => handleTebmCreation()}
              type="button"
            >
              New Total Expense By Month
            </button>
          </div>
          {tebms?.empty ? (
            <div className="tebm-nothing-to-show">
              Nothing to show here yet.
            </div>
          ) : (
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
              {tebms?.numberOfElements && tebms.numberOfElements > 3 && (
                <Pagination
                  pageCount={tebms ? tebms.totalPages : 0}
                  forcePage={tebms?.number}
                  range={2}
                  onChange={handlePageChange}
                  width={300}
                />
              )}
            </div>
          )}
        </div>
      </section>
      <aside id="side-section" className="side-section">
        <MyInfo />
        <Vault />
        <WishlistList sideElement={true} />
      </aside>
    </>
  );
};

export default Home;
