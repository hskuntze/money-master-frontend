import { createContext } from "react";

export type ThemeContextData = {
  theme: "light" | "dark";
};

export type ThemeContextType = {
  themeContextData: ThemeContextData;
  setThemeContextData: (themeContextData: ThemeContextData) => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  themeContextData: {
    theme: "light",
  },
  setThemeContextData: () => null,
});
