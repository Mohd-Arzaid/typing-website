import { TextField } from "@mui/material";
import { getToastTheme, isLightTheme, useTheme } from "../Context/ThemeContext";
import { useState } from "react";
import { Bounce, toast } from "react-toastify";
import { signIn } from "../lib/auth-client";

const LoginForm = ({ handleClose }) => {
  const { theme } = useTheme();
  const toastTheme = getToastTheme(theme);
  const light = isLightTheme(theme);
  const accent = theme.caret || theme.title;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const fieldSx = {
    "& .MuiInputLabel-root": {
      color: "var(--muted)",
      fontFamily: '"Space Grotesk", sans-serif',
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: accent,
    },
    "& .MuiOutlinedInput-root": {
      color: "var(--fg)",
      fontFamily: '"Space Grotesk", sans-serif',
      backgroundColor: light ? "var(--bg)" : "transparent",
      borderRadius: "8px",
      "& fieldset": {
        borderColor: "var(--border)",
      },
      "&:hover fieldset": {
        borderColor: "var(--muted)",
      },
      "&.Mui-focused fieldset": {
        borderColor: accent,
        borderWidth: "1.5px",
      },
    },
    "& .MuiFormHelperText-root": {
      color: "var(--error)",
      marginLeft: 0,
    },
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setEmailError("");
    setPasswordError("");

    let valid = true;
    if (!email) {
      setEmailError("Email is required");
      valid = false;
    }
    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    }
    if (!valid) return;

    setLoading(true);
    const { error } = await signIn.email({ email, password });
    setLoading(false);

    if (error) {
      toast.error(error.message || "Some error occured", {
        position: "top-right",
        autoClose: 5000,
        theme: toastTheme,
        transition: Bounce,
      });
      return;
    }

    toast.success("Logged in successfully.", {
      position: "top-right",
      autoClose: 5000,
      theme: toastTheme,
      transition: Bounce,
    });
    handleClose();
  };

  return (
    <form className="flex flex-col gap-3.5" onSubmit={handleSubmit}>
      <TextField
        type="email"
        variant="outlined"
        label="Email"
        size="small"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={Boolean(emailError)}
        helperText={emailError}
        sx={fieldSx}
        autoComplete="email"
      />

      <TextField
        type="password"
        variant="outlined"
        label="Password"
        size="small"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={Boolean(passwordError)}
        helperText={passwordError}
        sx={fieldSx}
        autoComplete="current-password"
      />

      <button
        type="submit"
        disabled={loading}
        className="mt-1 h-11 w-full rounded-lg bg-accent font-sans text-[0.95rem] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-65"
      >
        {loading ? "Signing in…" : "Log in"}
      </button>
    </form>
  );
};

export default LoginForm;
