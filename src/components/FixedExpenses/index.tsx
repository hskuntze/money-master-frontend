import "./styles.css";
import { useCallback, useEffect, useState } from "react";
import { FixedExpense } from "types/fixedexpense";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "util/requests";
import { toast } from "react-toastify";
import { SpringPage } from "types/springpage";
import Pagination from "components/Pagination";
import { formatDateToString, formatNumberToMoney } from "util/formatters";
import { Controller, useForm } from "react-hook-form";
import { CurrencyInput } from "react-currency-mask";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  const [beginDate, setBeginDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
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
    /*
      Reseta o estado da data para que o componente DatePicker
      resgate a data do elemento em si
     */
    setBeginDate(null);

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

  const handleDelete = (id: number) => {
    let confirm = window.confirm("Are you sure you want to delete it?");

    if (confirm) {
      const params: AxiosRequestConfig = {
        url: `/totalExpenseByMonths/delete/fixedExpense/${id}`,
        withCredentials: true,
        method: "DELETE",
      };

      requestBackend(params)
        .then((res) => {
          loadInfo();
          toast.success("Deleted");
        })
        .catch(() => {
          toast.error("Unable to delete");
        });
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

        setEditStates((prev) => ({
          ...prev,
          [fe.id]: !prev[fe.id],
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div
      className={`hpfe-outter-container general-outter-container ${editable ? "editable" : ""}`}
      style={
        typeof width === "number" ? { width: width + "%" } : { width: width }
      }
    >
      {fixedExpenses?.empty ? (
        <div className="nothing-to-show">Nothing to show here. Add some fixed expenses.</div>
      ) : (
        <>
          <div className="hpfe-header">
            <span key={"something"}>Your fixed expenses this month</span>
          </div>
          <div className="hpfe-inner-container">
            {fixedExpenses?.content.map((fe) => (
              <div key={fe.id + fe.title} style={{ width: "calc(100% / 6)" }}>
                {editable ? (
                  <div className="hpfe-item editable">
                    <div className="hpfe-edit-buttons">
                      <button
                        className="fixed-expense-manage-button"
                        type="button"
                        onClick={() => handleEditClick(fe.id)}
                      >
                        <i className="bi bi-pencil-square" />
                      </button>
                      <button
                        className="fixed-expense-manage-button"
                        type="button"
                        onClick={() => handleDelete(fe.id)}
                      >
                        <i className="bi bi-trash-fill" />
                      </button>
                    </div>
                    {editStates[fe.id] && editItemId === fe.id ? (
                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="hpfe-edit-container"
                      >
                        <input
                          type="text"
                          id="fixed-expense-title"
                          placeholder="Title"
                          className="fixed-expense-edit-input"
                          {...register("title", {})}
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
                                />
                              }
                            />
                          )}
                        />
                        <input
                          type="number"
                          id="fixed-expense-day-of-charge"
                          placeholder="Day of charge"
                          className="fixed-expense-edit-input"
                          max={31}
                          min={1}
                          {...register("dayOfCharge", {
                            max: 31,
                            min: 1,
                          })}
                        />
                        <div style={{ width: "90%" }}>
                          <Controller
                            name="beginOfExpense"
                            control={control}
                            render={({ field }) => (
                              <DatePicker
                                selected={
                                  beginDate !== null
                                    ? beginDate
                                    : new Date(fe.beginOfExpense + "T03:00:00Z")
                                }
                                onChange={(date) => setBeginDate(date)}
                                onSelect={(date) =>
                                  setValue(
                                    "beginOfExpense",
                                    formatDateToString(date)
                                  )
                                }
                                dateFormat={"dd/MM/yyyy"}
                                className="fixed-expense-edit-input date-picker begin"
                                placeholderText="Begin of expense charge date"
                              />
                            )}
                          />
                        </div>
                        <div style={{ width: "90%" }}>
                          <Controller
                            name="endOfExpense"
                            control={control}
                            render={({ field }) => (
                              <DatePicker
                                selected={
                                  endDate !== null
                                    ? endDate
                                    : new Date(fe.endOfExpense + "T03:00:00Z")
                                }
                                onChange={(date) => setEndDate(date)}
                                onSelect={(date) =>
                                  setValue(
                                    "endOfExpense",
                                    formatDateToString(date)
                                  )
                                }
                                dateFormat={"dd/MM/yyyy"}
                                className="fixed-expense-edit-input date-picker end"
                                placeholderText="End of expense charge date"
                              />
                            )}
                          />
                        </div>
                        <button type="submit">Save</button>
                      </form>
                    ) : (
                      <>
                        <span>{fe.title}</span>
                        <span>{formatNumberToMoney(fe.price)}</span>
                        <span>Day of Charge: {fe.dayOfCharge}</span>
                        <span>Begin at: {fe.beginOfExpense}</span>
                        <span>End at: {fe.endOfExpense}</span>
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
        </>
      )}
    </div>
  );
};

export default FixedExpenses;
