/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";

const initialState = {
  theme: "system", // Default theme as 'system'
  setTheme: () => null, // Placeholder for setTheme function
};

const ThemeProviderContext = createContext(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem(storageKey) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove any previously set classes for light/dark themes
    root.classList.remove("light", "dark");

    // Apply the appropriate theme based on the current theme state
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme); // either 'light' or 'dark'
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme) => {
      // Store the selected theme in localStorage and set it
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
