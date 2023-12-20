import { Address } from "./address";
import ExpenseTrack from "./expensetrack";
import { Role } from "./role";
import Vault from "./vault";
import { Wishlist } from "./wishlist";

export type User = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  idNumber: number;
  idType: number;
  birth: string;
  enabled: boolean;
  registrationCompleted: boolean;
  gender: number;
  address: Address;
  vault: Vault;
  expenseTrack: ExpenseTrack;
  roles: Role[]
  wishlists: Wishlist[];
};
