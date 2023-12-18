import { ItemPrice } from "./itemprice";

export type ItemHistory = {
  id: number;
  fluctuation: number;
  itemPrices: ItemPrice[];
};
