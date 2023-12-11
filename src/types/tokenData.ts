import { Role } from "./role";

export type TokenData = {
  exp: number;
  user_name: string;
  authorities: Role[];
};
