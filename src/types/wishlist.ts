import { Installment } from "./installment";
import { Item } from "./item";

export type Wishlist = {
  id: number;
  title: string;
  description: string;
  totalValue: number;
  created: string;
  enabled: boolean;
  toBuyAt: string;
  installment: boolean;
  totalInstallments: number;
  installmentsValue: number;
  items: Item[];
  installments: Installment[];
};
