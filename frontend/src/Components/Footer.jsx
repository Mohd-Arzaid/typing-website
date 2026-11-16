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
          className="inline-block h-2.5 w-2.5 shrink-0 rounded-full border border-black/10"
          style={{ backgroundColor: accent }}
          aria-hidden
        />
        <span>{props.data.label}</span>
      </div>
    </components.SingleValue>
  );
};

const selectStyles = {
  control: (styles, state) => ({
    ...styles,
    backgroundColor: "var(--surface)",
    borderColor: state.isFocused ? "var(--accent)" : "var(--border)",
    borderRadius: "9999px",
    borderWidth: "1px",
    boxShadow: state.isFocused ? "0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent)" : "none",
    minHeight: "36px",
    paddingLeft: "4px",
    paddingRight: "2px",
    fontSize: "0.875rem",
    cursor: "pointer",
    transition: "border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease",
    "&:hover": {
      borderColor: "var(--accent)",
    },
  }),
  valueContainer: (styles) => ({
    ...styles,
    padding: "0 8px",
  }),
  menu: (styles) => ({
    ...styles,
    backgroundColor: "var(--surface)",
    borderRadius: "14px",
    padding: "0.4rem",
    border: "1px solid var(--border)",
    boxShadow: "var(--menu-shadow)",
    overflow: "hidden",
    maxHeight: "none",
    zIndex: 40,
  }),
  menuPortal: (styles) => ({
    ...styles,
    zIndex: 40,
  }),
  menuList: (styles) => ({
    ...styles,
    maxHeight: "none",
    padding: 0,
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isSelected
      ? "color-mix(in srgb, var(--accent) 16%, transparent)"
      : isFocused
        ? "color-mix(in srgb, var(--accent) 10%, transparent)"
        : "transparent",
    color: isSelected || isFocused ? "var(--accent)" : "var(--fg)",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: isSelected ? 600 : 500,
    padding: "8px 10px",
    marginBottom: "2px",
    transition: "background-color 0.12s ease, color 0.12s ease",
  }),
  singleValue: (styles) => ({
    ...styles,
    color: "var(--accent)",
    fontWeight: 500,
  }),
  placeholder: (styles) => ({
    ...styles,
    color: "var(--muted)",
  }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (styles) => ({
    ...styles,
    color: "var(--accent)",
    padding: "0 10px 0 4px",
    "&:hover": { color: "var(--accent)" },
  }),
};

const Footer = () => {
  const { setTheme, theme } = useTheme();

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
          menuPortalTarget={typeof document !== "undefined" ? document.body : null}
          menuPosition="fixed"
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
          styles={selectStyles}
        />
      </div>
    </footer>
  );
};

export default Footer;
