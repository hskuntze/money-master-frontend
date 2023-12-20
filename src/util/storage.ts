import { User } from "types/user";

type LoginResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
};

export const saveAuthData = (obj: LoginResponse) => {
  localStorage.setItem("authData", JSON.stringify(obj));
};

export const getAuthData = () => {
  const str = localStorage.getItem("authData") ?? "{}";
  return JSON.parse(str) as LoginResponse;
};

export const removeAuthData = () => {
  localStorage.removeItem("authData");
};

export const saveUserData = (obj: User) => {
  localStorage.setItem("userData", JSON.stringify(obj));
}

export const getUserData = () => {
  const str = localStorage.getItem("userData") ?? "{}";
  return JSON.parse(str) as User;
}

export const removeUserData = () => {
  localStorage.removeItem("userData");
}