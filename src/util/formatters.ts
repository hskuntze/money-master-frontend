export function formatNumberToMoney(value: number) {
  return value.toLocaleString("pt-BR", { currency: "BRL", style: "currency" });
};