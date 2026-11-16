import { createContext, useContext, useLayoutEffect, useState } from "react";
import { themeOptions } from "../Utils/themeOptions";

const ThemeContext = createContext();

const parseHex = (color) => {
  if (!color || typeof color !== "string") return null;
  let hex = color.trim();
  if (hex.startsWith("#")) hex = hex.slice(1);
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return null;
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  };
};

/** Relative luminance (sRGB). Higher = lighter. */
export const getBackgroundLuminance = (background) => {
  const rgb = parseHex(background);
  if (!rgb) return 0;
  const channel = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
};

export const isLightTheme = (themeOrBg) => {
  const bg =
    typeof themeOrBg === "string" ? themeOrBg : themeOrBg?.background;
  return getBackgroundLuminance(bg) > 0.55;
};

export const getToastTheme = (theme) => (isLightTheme(theme) ? "light" : "dark");

export const applyThemeVars = (theme) => {
  if (!theme || typeof document === "undefined") return;

  const root = document.documentElement;
  const light = isLightTheme(theme);

  root.style.setProperty("--bg", theme.background);
  root.style.setProperty("--fg", theme.correct || theme.textColor);
  root.style.setProperty("--muted", theme.textColor);
  root.style.setProperty("--accent", theme.title);
  root.style.setProperty("--correct", theme.correct || theme.title);
  root.style.setProperty("--caret", theme.caret || theme.title);
  root.style.setProperty("--error", theme.error || "#e7000b");
  root.style.setProperty("--untyped", theme.typeBoxText);

  if (light) {
    root.style.setProperty("--border", "#e4e4e7");
    root.style.setProperty("--surface", "#fafafa");
    root.style.setProperty("--kbd-bg", "#f4f4f5");
    root.style.setProperty("--menu-shadow", "0 12px 32px rgba(9, 9, 11, 0.12)");
  } else {
    root.style.setProperty(
      "--border",
      "color-mix(in srgb, #ffffff 12%, var(--bg))"
    );
    root.style.setProperty(
      "--surface",
      "color-mix(in srgb, #ffffff 7%, var(--bg))"
    );
    root.style.setProperty(
      "--kbd-bg",
      "color-mix(in srgb, #ffffff 8%, var(--bg))"
    );
    root.style.setProperty("--menu-shadow", "0 16px 40px rgba(0, 0, 0, 0.45)");
  }

  root.style.colorScheme = light ? "light" : "dark";

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

const getInitialTheme = () => {
  const theme = getStoredTheme();
  applyThemeVars(theme);
  return theme;
};

export const ThemeContextProvider = ({ children }) => {
  const [theme, setThemeState] = useState(getInitialTheme);

  const setTheme = (next) => {
    setThemeState(next);
    localStorage.setItem("theme", JSON.stringify(next));
    applyThemeVars(next);
  };

  useLayoutEffect(() => {
    applyThemeVars(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isLight: isLightTheme(theme) }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
