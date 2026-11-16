import { createContext, useContext, useEffect, useState } from "react";
import { themeOptions } from "../Utils/themeOptions";

const ThemeContext = createContext();

const isLightBackground = (background) => background === "#ffffff";

export const applyThemeVars = (theme) => {
  const root = document.documentElement;
  const light = isLightBackground(theme.background);

  root.style.setProperty("--bg", theme.background);
  root.style.setProperty("--fg", theme.correct || theme.textColor);
  root.style.setProperty("--muted", theme.textColor);
  root.style.setProperty("--accent", theme.title);
  root.style.setProperty("--correct", theme.correct || theme.title);
  root.style.setProperty("--caret", theme.caret || theme.title);
  root.style.setProperty("--error", theme.error || "#e7000b");
  root.style.setProperty("--untyped", theme.typeBoxText);
  root.style.setProperty(
    "--border",
    light ? "#e4e4e7" : "rgba(255,255,255,0.12)"
  );
  root.style.setProperty(
    "--surface",
    light ? "#fafafa" : theme.background
  );
  root.style.setProperty(
    "--kbd-bg",
    light ? "#f4f4f5" : "rgba(255,255,255,0.06)"
  );

  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme.background);
};

const getStoredTheme = () => {
  try {
    const stored = localStorage.getItem("theme");
    if (!stored) return themeOptions[0].value;
    const parsed = JSON.parse(stored);
    if (parsed && typeof parsed === "object" && parsed.background) {
      const matched = themeOptions.find(
        (option) => option.label === parsed.label
      );
      return matched
        ? matched.value
        : { ...themeOptions[0].value, ...parsed };
    }
  } catch {
    // Legacy/invalid values
  }
  localStorage.removeItem("theme");
  return themeOptions[0].value;
};

export const ThemeContextProvider = ({ children }) => {
  const [theme, setThemeState] = useState(getStoredTheme);

  const setTheme = (next) => {
    setThemeState(next);
    localStorage.setItem("theme", JSON.stringify(next));
  };

  useEffect(() => {
    applyThemeVars(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
