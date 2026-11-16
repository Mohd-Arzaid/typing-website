import Select, { components } from "react-select";
import { IconBrandGithub, IconPalette } from "@tabler/icons-react";
import { themeOptions } from "../Utils/themeOptions";
import { useTheme } from "../Context/ThemeContext";
import CornerBrackets from "./CornerBrackets";

const ThemeOption = (props) => {
  const accent = props.data?.value?.title || props.data?.value?.caret;
  return (
    <components.Option {...props}>
      <div className="flex items-center gap-2.5">
        <span
          className="inline-block h-3 w-3 shrink-0 rounded-full border border-black/10"
          style={{ backgroundColor: accent }}
          aria-hidden
        />
        <span>{props.label}</span>
      </div>
    </components.Option>
  );
};

const ThemeSingleValue = (props) => {
  const accent = props.data?.value?.title || props.data?.value?.caret;
  return (
    <components.SingleValue {...props}>
      <div className="flex items-center gap-2">
        <span
          className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: accent }}
          aria-hidden
        />
        <span>{props.data.label}</span>
      </div>
    </components.SingleValue>
  );
};

const Footer = () => {
  const { setTheme, theme } = useTheme();
  const menuBorder =
    theme.background === "#ffffff" ? "#e4e4e7" : `${theme.title}40`;

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

      <div className="min-w-44">
        <Select
          onChange={handleChange}
          options={themeOptions}
          menuPlacement="top"
          value={{ label: theme.label, value: theme }}
          components={{
            Option: ThemeOption,
            SingleValue: ThemeSingleValue,
            DropdownIndicator: (props) => (
              <components.DropdownIndicator {...props}>
                <IconPalette size={16} stroke={1.75} />
              </components.DropdownIndicator>
            ),
          }}
          styles={{
            control: (styles, state) => ({
              ...styles,
              backgroundColor: theme.background,
              borderColor: theme.title,
              borderRadius: "9999px",
              boxShadow: state.isFocused
                ? `0 0 0 3px ${theme.title}22`
                : "none",
              minHeight: "36px",
              paddingLeft: "4px",
              paddingRight: "2px",
              fontSize: "0.875rem",
              cursor: "pointer",
              transition: "border-color 0.15s ease, box-shadow 0.15s ease",
              "&:hover": {
                borderColor: theme.title,
              },
            }),
            valueContainer: (styles) => ({
              ...styles,
              padding: "0 8px",
            }),
            menu: (styles) => ({
              ...styles,
              backgroundColor: theme.background,
              borderRadius: "14px",
              padding: "0.4rem",
              border: `1px solid ${menuBorder}`,
              boxShadow: "0 12px 32px rgba(9,9,11,0.12)",
              overflow: "hidden",
              maxHeight: "none",
            }),
            menuList: (styles) => ({
              ...styles,
              maxHeight: "none",
              padding: 0,
            }),
            option: (styles, { isFocused, isSelected }) => ({
              ...styles,
              backgroundColor: isSelected
                ? theme.title
                : isFocused
                  ? `${theme.title}18`
                  : "transparent",
              color: isSelected ? theme.background : theme.correct || theme.textColor,
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: isSelected ? 600 : 500,
              padding: "8px 10px",
              marginBottom: "2px",
            }),
            singleValue: (styles) => ({
              ...styles,
              color: theme.title,
              fontWeight: 500,
            }),
            placeholder: (styles) => ({
              ...styles,
              color: theme.textColor,
            }),
            indicatorSeparator: () => ({ display: "none" }),
            dropdownIndicator: (styles) => ({
              ...styles,
              color: theme.title,
              padding: "0 10px 0 4px",
              "&:hover": { color: theme.title },
            }),
          }}
        />
      </div>
    </footer>
  );
};

export default Footer;
