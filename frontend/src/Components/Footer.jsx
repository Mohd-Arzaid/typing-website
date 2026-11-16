import Select from "react-select";
import { themeOptions } from "../Utils/themeOptions";
import { useTheme } from "../Context/ThemeContext";
import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const iconButtonClass =
  "inline-flex items-center justify-center rounded-lg p-1.5 text-muted transition-colors hover:text-correct focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40";

const Footer = () => {
  const { setTheme, theme } = useTheme();
  const borderColor =
    theme.background === "#ffffff" ? "#e4e4e7" : theme.title;

  const handleChange = (e) => {
    setTheme(e.value);
  };

  return (
    <footer className="mx-auto flex w-full max-w-site flex-wrap items-center justify-between gap-4 py-2 text-muted max-md:justify-center">
      <div className="flex items-center gap-0.5">
        <a
          href="https://github.com/Mohd-Arzaid"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className={iconButtonClass}
        >
          <GitHubIcon sx={{ fontSize: 20 }} />
        </a>
        <a
          href="https://www.linkedin.com/in/mohd-arzaid-3220742ab/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className={iconButtonClass}
        >
          <LinkedInIcon sx={{ fontSize: 20 }} />
        </a>
        <a
          href="https://x.com/_Arzaid_"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X"
          className={iconButtonClass}
        >
          <TwitterIcon sx={{ fontSize: 20 }} />
        </a>
      </div>

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
