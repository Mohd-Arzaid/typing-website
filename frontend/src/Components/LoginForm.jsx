import { TextField } from "@mui/material";
import { useTheme } from "../Context/ThemeContext";
import { useState } from "react";
import { Bounce, toast } from "react-toastify";
import { signIn } from "../lib/auth-client";

const LoginForm = ({ handleClose }) => {
  const { theme } = useTheme();
  const toastTheme = theme.background === "#ffffff" ? "light" : "dark";
  const isLight = theme.background === "#ffffff";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const fieldSx = {
    "& .MuiInputLabel-root": {
      color: theme.textColor,
      fontFamily: '"Space Grotesk", sans-serif',
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: theme.caret || theme.title,
    },
    "& .MuiOutlinedInput-root": {
      color: theme.correct || theme.textColor,
      fontFamily: '"Space Grotesk", sans-serif',
      backgroundColor: isLight ? "#ffffff" : "transparent",
      borderRadius: "8px",
      "& fieldset": {
        borderColor: isLight ? "#e4e4e7" : "rgba(255,255,255,0.16)",
      },
      "&:hover fieldset": {
        borderColor: theme.textColor,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.caret || theme.title,
        borderWidth: "1.5px",
      },
    },
    "& .MuiFormHelperText-root": {
      color: theme.error || "#e7000b",
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
