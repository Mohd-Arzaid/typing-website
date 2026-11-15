import { createContext, useContext, useState } from "react";
import { themeOptions } from "../Utils/themeOptions";


const ThemeContext = createContext();

const getStoredTheme = () => {
    try {
        const stored = localStorage.getItem("theme");
        if (!stored) return themeOptions[0].value;
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object" && parsed.background) {
            return parsed;
        }
    } catch {
        // Legacy/invalid values (e.g. plain "light") are not valid JSON
    }
    localStorage.removeItem("theme");
    return themeOptions[0].value;
};

export const ThemeContextProvider=({children})=>{


    const [theme, setTheme]=useState(getStoredTheme);

    const values={
        theme,
        setTheme,
        
    
    }

    return (<ThemeContext.Provider value={values}>{children}</ThemeContext.Provider>)
}

export const useTheme= ()=> useContext(ThemeContext);
