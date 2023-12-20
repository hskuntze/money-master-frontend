export function formatNumberToMoney(value: number) {
  return value.toLocaleString("pt-BR", { currency: "BRL", style: "currency" });
}

export function formatStringToDate(date: string) {
  let newDate = new Date(date + "T03:00:00Z");
  return newDate.toLocaleDateString("pt-BR");
}

export const getMonthNameFromDate = (date: string) => {
  let newDate = new Date(date + "T03:00:00Z");
  let monthNumber = newDate.getMonth();
  let month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][monthNumber];

  return month;
};