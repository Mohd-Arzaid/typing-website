import Select from "react-select";
import { themeOptions } from "../Utils/themeOptions";
import { useTheme } from "../Context/ThemeContext";
import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const Footer = () => {
  const { setTheme, theme } = useTheme();
  const borderColor =
    theme.background === "#ffffff" ? "#e4e4e7" : theme.title;

  const handleChange = (e) => {
    setTheme(e.value);
    localStorage.setItem("theme", JSON.stringify(e.value));
  };

  return (
    <div className="footer">
      <div className="links">
        <a
          href="https://github.com/Mohd-Arzaid"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <GitHubIcon fontSize="small" />
        </a>
        <a
          href="https://www.linkedin.com/in/mohd-arzaid-3220742ab/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <LinkedInIcon fontSize="small" />
        </a>
        <a
          href="https://x.com/_Arzaid_"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X"
        >
          <TwitterIcon fontSize="small" />
        </a>
      </div>

      <div className="themeButton">
        <Select
          onChange={handleChange}
          options={themeOptions}
          menuPlacement="top"
          defaultValue={{ label: theme.label, value: theme }}
          styles={{
            control: (styles) => ({
              ...styles,
              backgroundColor: theme.background,
              borderColor,
              boxShadow: "none",
              minHeight: "36px",
              fontSize: "0.875rem",
              "&:hover": {
                borderColor: theme.title,
              },
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
              color: isFocused
                ? theme.background
                : theme.textColor,
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
    </div>
  );
};

export default Footer;
