import "./styles.css";
import { useCallback, useEffect, useState } from "react";
import { FixedExpense } from "types/fixedexpense";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "util/requests";
import { toast } from "react-toastify";
import { SpringPage } from "types/springpage";
import Pagination from "components/Pagination";
import { formatNumberToMoney } from "util/formatters";
import { Controller, useForm } from "react-hook-form";
import { CurrencyInput } from "react-currency-mask";

type HpfeContentData = {
  activePage: number;
};

interface EditableItem {
  [key: number]: boolean;
}

interface Props {
  width?: number | string;
  editable: boolean;
}

const FixedExpenses = ({ width, editable }: Props) => {
  const [fixedExpenses, setFixedExpenses] =
    useState<SpringPage<FixedExpense>>();
  const [editStates, setEditStates] = useState<EditableItem>({});
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const [hpfeContentData, setHpfeContentData] = useState<HpfeContentData>({
    activePage: 0,
  });

  const { register, handleSubmit, control, setValue } = useForm<FixedExpense>();

  const loadInfo = useCallback(() => {
    const params: AxiosRequestConfig = {
      url: "/totalExpenseByMonths/findAll/fixedExpenses/validdate",
      method: "GET",
      withCredentials: true,
      params: {
        size: 5,
        page: hpfeContentData.activePage,
        sort: "price,desc",
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

  const handleEditClick = (feId: number) => {
    //Determina que o item é editável
    setEditStates((prev) => ({
      ...prev,
      [feId]: !prev[feId],
    }));

    //Determina qual item será editado
    setEditItemId(feId);

    //Preenche os campos de edição
    const fe = fixedExpenses?.content.find((item) => item.id === feId);
    if (fe) {
      setValue("id", fe.id);
      setValue("title", fe.title);
      setValue("price", fe.price);
      setValue("dayOfCharge", fe.dayOfCharge);
      setValue("beginOfExpense", fe.beginOfExpense);
      setValue("endOfExpense", fe.endOfExpense);
    }
  };

  const onSubmit = (fe: FixedExpense) => {
    const params: AxiosRequestConfig = {
      url: `/totalExpenseByMonths/update/fixedExpense/${fe.id}`,
      withCredentials: true,
      method: "PUT",
      data: {
        title: fe.title,
        price: fe.price,
        beginOfExpense: fe.beginOfExpense,
        endOfExpense: fe.endOfExpense,
        dayOfCharge: fe.dayOfCharge,
      },
    };

    requestBackend(params)
      .then((res) => {
        loadInfo();
        toast.success("Saved!");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div
      className="hpfe-outter-container"
      style={
        typeof width === "number" ? { width: width + "%" } : { width: width }
      }
    >
      <div className="hpfe-header">
        <span key={"something"}>Your fixed expenses this month</span>
      </div>
      <div className="hpfe-inner-container">
        {fixedExpenses?.content.map((fe) => (
          <div key={fe.id + fe.title} style={{width: "calc(100% / 6)"}}>
            {editable ? (
              <div
                className="hpfe-item"
                onClick={() => handleEditClick(fe.id)}
              >
                {editStates[fe.id] && editItemId === fe.id ? (
                  <form onSubmit={handleSubmit(onSubmit)} className="hpfe-edit-container">
                    <input
                      type="text"
                      id="fixed-expense-title"
                      placeholder="Title"
                      className="fixed-expense-edit-input"
                      {...register("title", {})}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Controller
                      name="price"
                      control={control}
                      key={fe.id}
                      render={({ field }) => (
                        <CurrencyInput
                          value={fe.price}
                          onChangeValue={(_, value) => {
                            field.onChange(value);
                          }}
                          InputElement={
                            <input
                              type="text"
                              id="fixed-expense-price"
                              placeholder="Price"
                              className="fixed-expense-edit-input"
                              onClick={(e) => e.stopPropagation()}
                            />
                          }
                        />
                      )}
                    />
                    <input
                      type="text"
                      id="fixed-expense-day-of-charge"
                      placeholder="Day of charge"
                      className="fixed-expense-edit-input"
                      {...register("dayOfCharge", {})}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button type="submit" onClick={(e) => e.stopPropagation()}>
                      Save
                    </button>
                  </form>
                ) : (
                  <>
                    <span>{fe.title}</span>
                    <span>{formatNumberToMoney(fe.price)}</span>
                    <span>Day of Charge: {fe.dayOfCharge}</span>
                  </>
                )}
              </div>
            ) : (
              <div className="hpfe-item" key={fe.id}>
                <span>{fe.title}</span>
                <span>{formatNumberToMoney(fe.price)}</span>
                <span>Day of Charge: {fe.dayOfCharge}</span>
              </div>
            )}
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

export default FixedExpenses;
