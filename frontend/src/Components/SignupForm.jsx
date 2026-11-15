import { Box, Button, TextField } from "@mui/material";
import { useTheme } from "../Context/ThemeContext";
import { useState } from "react";
import { Bounce, toast } from "react-toastify";
import { signUp } from "../lib/auth-client";

const SignupForm = ({ handleClose }) => {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password || !confirmPassword) {
      toast.warning("Please fill in all required fields.", {
        position: "top-right",
        autoClose: 5000,
        theme: "dark",
        transition: Bounce,
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.warning("Password mismatch", {
        position: "top-right",
        autoClose: 5000,
        theme: "dark",
        transition: Bounce,
      });
      return;
    }

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
        theme: "dark",
        transition: Bounce,
      });
      return;
    }

    toast.success("User created", {
      position: "top-right",
      autoClose: 5000,
      theme: "dark",
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

      <TextField
        type="password"
        variant="outlined"
        label="Enter Confirm Password"
        onChange={(e) => setConfirmPassword(e.target.value)}
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
        SignUp
      </Button>
    </Box>
  );
};

export default SignupForm;
