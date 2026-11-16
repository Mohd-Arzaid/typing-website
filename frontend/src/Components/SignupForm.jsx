import { TextField } from "@mui/material";
import { useTheme } from "../Context/ThemeContext";
import { useState } from "react";
import { Bounce, toast } from "react-toastify";
import { signUp } from "../lib/auth-client";

const SignupForm = ({ handleClose }) => {
  const { theme } = useTheme();
  const toastTheme = theme.background === "#ffffff" ? "light" : "dark";
  const isLight = theme.background === "#ffffff";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
    const nextErrors = {};

    if (!email) nextErrors.email = "Email is required";
    if (!password) nextErrors.password = "Password is required";
    if (!confirmPassword) nextErrors.confirmPassword = "Confirm your password";
    if (password && confirmPassword && password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    const { error } = await signUp.email({
      email,
      password,
      name: email.split("@")[0],
    });
    setLoading(false);

    if (error) {
      toast.error(error.message || "some error occured", {
        position: "top-right",
        autoClose: 5000,
        theme: toastTheme,
        transition: Bounce,
      });
      return;
    }

    toast.success("User created", {
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
        error={Boolean(errors.email)}
        helperText={errors.email}
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
        error={Boolean(errors.password)}
        helperText={errors.password}
        sx={fieldSx}
        autoComplete="new-password"
      />

      <TextField
        type="password"
        variant="outlined"
        label="Confirm password"
        size="small"
        fullWidth
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={Boolean(errors.confirmPassword)}
        helperText={errors.confirmPassword}
        sx={fieldSx}
        autoComplete="new-password"
      />

      <button
        type="submit"
        disabled={loading}
        className="mt-1 h-11 w-full rounded-lg bg-accent font-sans text-[0.95rem] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-65"
      >
        {loading ? "Creating…" : "Create account"}
      </button>
    </form>
  );
};

export default SignupForm;
