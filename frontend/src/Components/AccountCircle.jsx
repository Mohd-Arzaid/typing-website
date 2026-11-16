import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { AppBar, Box, Button, Modal, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { useTheme } from "../Context/ThemeContext";
import { Bounce, toast } from "react-toastify";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { signIn, signOut, useSession } from "../lib/auth-client";

const AccountCircle = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const { theme } = useTheme();
  const toastTheme = theme.background === "#ffffff" ? "light" : "dark";
  const navigate = useNavigate();
  const { data: session } = useSession();
  const user = session?.user;

  const handleModalOpen = () => {
    if (user) {
      navigate("/user");
    } else {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleValueChange = (_e, v) => {
    setValue(v);
  };

  const logout = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Not able to logout", {
        position: "top-right",
        autoClose: 5000,
        theme: toastTheme,
        transition: Bounce,
      });
      return;
    }

    toast.success("Logged out", {
      position: "top-right",
      autoClose: 5000,
      theme: toastTheme,
      transition: Bounce,
    });
  };

  const handleGoogleSignIn = async () => {
    const { error } = await signIn.social({
      provider: "google",
      callbackURL: window.location.origin,
    });

    if (error) {
      toast.error(error.message || "Not able to use google authentication", {
        position: "top-right",
        autoClose: 5000,
        theme: toastTheme,
        transition: Bounce,
      });
    }
  };

  return (
    <div>
      <AccountCircleIcon onClick={handleModalOpen} />
      {user && <LogoutIcon onClick={logout} />}
      <Modal
        open={open}
        onClose={handleClose}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "min(400px, 92vw)",
            textAlign: "center",
            background: theme.background,
            color: theme.textColor,
            borderRadius: "12px",
            padding: "12px 16px 20px",
            border:
              theme.background === "#ffffff"
                ? "1px solid #e4e4e7"
                : "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <AppBar position="static" style={{ background: "transparent" }}>
            <Tabs
              value={value}
              onChange={handleValueChange}
              variant="fullWidth"
            >
              <Tab label="login" style={{ color: theme.textColor }} />
              <Tab label="signup" style={{ color: theme.textColor }} />
            </Tabs>
          </AppBar>
          <div style={{ padding: "16px 0" }}>
            {value === 0 && <LoginForm handleClose={handleClose} />}
            {value === 1 && <SignupForm handleClose={handleClose} />}
          </div>
          <Box>
            <span>OR</span>
            <Button
              variant="contained"
              fullWidth
              onClick={handleGoogleSignIn}
              style={{
                marginTop: "8px",
                backgroundColor: theme.title,
                color: theme.background,
              }}
            >
              Continue with Google
            </Button>
          </Box>
        </div>
      </Modal>
    </div>
  );
};

export default AccountCircle;
