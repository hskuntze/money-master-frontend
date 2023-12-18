import { ItemHistory } from "./itemhistory";

export type Item = {
  id: number;
  name: string;
  price: number;
  link: string;
  image: string;
  sourcePlatform: string;
  sourcePlatformName: string;
  itemHistory: ItemHistory;
};
