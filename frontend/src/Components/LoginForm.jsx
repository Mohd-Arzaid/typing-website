import { Box, Button, TextField } from "@mui/material";
import { useTheme } from "../Context/ThemeContext";
import { useState } from "react";
import { Bounce, toast } from "react-toastify";
import { signIn } from "../lib/auth-client";

const LoginForm = ({ handleClose }) => {
  const { theme } = useTheme();
  const toastTheme = theme.background === "#ffffff" ? "light" : "dark";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      toast.warning("Please fill in all required fields.", {
        position: "top-right",
        autoClose: 5000,
        theme: toastTheme,
        transition: Bounce,
      });
      return;
    }

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
    <Box
      p={3}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <TextField
        type="email"
        variant="outlined"
        label="Enter Email"
        onChange={(e) => setEmail(e.target.value)}
        InputLabelProps={{
          style: {
            color: theme.title,
          },
        }}
        InputProps={{
          style: {
            color: theme.title,
          },
        }}
      />

      <TextField
        type="password"
        variant="outlined"
        label="Enter Password"
        onChange={(e) => setPassword(e.target.value)}
        InputLabelProps={{
          style: {
            color: theme.title,
          },
        }}
        InputProps={{
          style: {
            color: theme.title,
          },
        }}
      />
      <Button
        variant="contained"
        size="large"
        style={{ backgroundColor: theme.title, color: theme.background }}
        onClick={handleSubmit}
        disabled={loading}
      >
        Login
      </Button>
    </Box>
  );
};

export default LoginForm;
