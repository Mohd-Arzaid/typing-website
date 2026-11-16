import Select from "react-select";
import { IconBrandGithub } from "@tabler/icons-react";
import { themeOptions } from "../Utils/themeOptions";
import { useTheme } from "../Context/ThemeContext";
import CornerBrackets from "./CornerBrackets";

const Footer = () => {
  const { setTheme, theme } = useTheme();
  const borderColor = theme.background === "#ffffff" ? "#e4e4e7" : theme.title;

  const handleChange = (e) => {
    setTheme(e.value);
  };

  return (
    <footer className="mx-auto flex w-full max-w-site flex-wrap items-center justify-between gap-4 py-2 text-muted max-md:justify-center">
      <CornerBrackets>
        <a
          href="https://github.com/Mohd-Arzaid"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 items-center gap-2 rounded-none border border-accent bg-accent px-3 font-sans text-sm font-medium text-bg no-underline transition-colors hover:bg-accent/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caret"
          aria-label="Open Source on GitHub"
        >
          <IconBrandGithub size={18} stroke={1.75} />
          <span>Open Source</span>
        </a>
      </CornerBrackets>

      <div className="min-w-40">
        <Select
          onChange={handleChange}
          options={themeOptions}
          menuPlacement="top"
          value={{ label: theme.label, value: theme }}
          styles={{
            control: (styles) => ({
              ...styles,
              backgroundColor: theme.background,
              borderColor,
              boxShadow: "none",
              minHeight: "36px",
              fontSize: "0.875rem",
              "&:hover": { borderColor: theme.title },
            }),
            menu: (styles) => ({
              ...styles,
              backgroundColor: theme.background,
              borderRadius: "8px",
              padding: "0.35rem",
              border: `1px solid ${borderColor}`,
              maxHeight: "none",
            }),
            menuList: (styles) => ({
              ...styles,
              maxHeight: "none",
            }),
            option: (styles, { isFocused }) => ({
              ...styles,
              backgroundColor: isFocused ? theme.title : theme.background,
              color: isFocused ? theme.background : theme.textColor,
              cursor: "pointer",
              fontSize: "0.875rem",
            }),
            singleValue: (styles) => ({
              ...styles,
              color: theme.title,
            }),
            placeholder: (styles) => ({
              ...styles,
              color: theme.textColor,
            }),
            indicatorSeparator: () => ({ display: "none" }),
          }}
        />
      </div>
    </footer>
  );
};

export default Footer;
