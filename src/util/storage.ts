import { User } from "types/user";
import { Wishlist } from "types/wishlist";

type LoginResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
};

/**
 * Authentication Data
 */
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

/**
 * User Data (including vault)
 */
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

/**
 * Wishlist Data
 */
export const saveWishlistData = (obj: Wishlist[]) => {
  localStorage.setItem("wishlists", JSON.stringify(obj));
}

export const getWishlistData = () => {
  const str = localStorage.getItem("wishlists") ?? "{}";
  return JSON.parse(str) as Wishlist[];
}

export const removeWishlistData = () => {
  localStorage.removeItem("wishlists");
}