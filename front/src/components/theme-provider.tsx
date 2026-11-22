import * as React from "react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";
type ThemePreference = Theme | "system";

export const THEME_STORAGE_KEY = "ds-theme";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

function readStoredTheme(fallback: ThemePreference): ThemePreference {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") return stored;
  } catch {
    /* ignore */
  }
  return fallback;
}

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * The system preference is used by default. Explicit user choices are persisted
 * and restored on return visits.
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
}: {
  children: React.ReactNode;
  defaultTheme?: ThemePreference;
}) {
  const [preference, setPreference] = useState<ThemePreference>(() =>
    readStoredTheme(defaultTheme),
  );
  const [systemTheme, setSystemTheme] = useState<Theme>(getSystemTheme);
  const theme = preference === "system" ? systemTheme : preference;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemTheme = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", updateSystemTheme);
    return () => mediaQuery.removeEventListener("change", updateSystemTheme);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    root.style.colorScheme = theme;
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, t);
    } catch {
      /* ignore */
    }
    setPreference(t);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
