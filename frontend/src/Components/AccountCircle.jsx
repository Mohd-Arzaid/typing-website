import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { Modal } from "@mui/material";
import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { getToastTheme, useTheme } from "../Context/ThemeContext";
import { useTypingFocus } from "../Context/TypingFocusContext";
import { Bounce, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { signIn, signOut, useSession } from "../lib/auth-client";

const AccountCircle = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const { theme } = useTheme();
  const toastTheme = getToastTheme(theme);
  const { setPauseRefocus, focusTypingInput } = useTypingFocus();
  const navigate = useNavigate();
  const { data: session } = useSession();
  const user = session?.user;

  const handleModalOpen = () => {
    if (user) {
      navigate("/user");
    } else {
      setPauseRefocus(true);
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setPauseRefocus(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(focusTypingInput);
    });
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
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="inline-flex h-9 items-center gap-2 rounded-full border border-accent bg-bg px-3.5 font-sans text-sm font-medium text-accent transition-colors duration-200 hover:bg-accent/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caret"
        onMouseDown={() => {
          if (!user) setPauseRefocus(true);
        }}
        onClick={handleModalOpen}
        aria-label={user ? "Open profile" : "Sign in"}
      >
        <AccountCircleIcon sx={{ fontSize: 20 }} />
        <span className="hidden md:inline">Profile</span>
      </button>
      {user && (
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-1.5 text-muted transition-colors hover:bg-accent/10 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caret"
          onClick={logout}
          aria-label="Log out"
        >
          <LogoutIcon fontSize="medium" />
        </button>
      )}

      <Modal
        open={open}
        onClose={handleClose}
        disableRestoreFocus
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: "rgba(9, 9, 11, 0.35)",
              backdropFilter: "blur(4px)",
            },
          },
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <div className="w-[min(420px,92vw)] max-h-[90vh] overflow-y-auto rounded-[14px] border border-border bg-surface p-6 text-left text-muted shadow-[0_12px_40px_rgba(9,9,11,0.1)] outline-none font-sans">
          <div className="mb-4">
            <h2 className="m-0 text-[1.35rem] font-bold tracking-tight text-correct">
              {value === 0 ? "Welcome back" : "Create account"}
            </h2>
            <p className="mt-1.5 mb-0 text-[0.9rem] opacity-90">
              {value === 0
                ? "Sign in to save your results"
                : "Join and track your typing progress"}
            </p>
          </div>

          <div
            className="mb-4 grid grid-cols-2 border-b border-border"
            role="tablist"
          >
            <button
              type="button"
              role="tab"
              aria-selected={value === 0}
              className={[
                "border-b-2 bg-transparent px-2 py-2.5 font-sans text-[0.95rem] transition-colors",
                value === 0
                  ? "border-caret font-semibold text-accent opacity-100"
                  : "border-transparent font-medium text-muted opacity-70",
              ].join(" ")}
              onClick={() => setValue(0)}
            >
              Log in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={value === 1}
              className={[
                "border-b-2 bg-transparent px-2 py-2.5 font-sans text-[0.95rem] transition-colors",
                value === 1
                  ? "border-caret font-semibold text-accent opacity-100"
                  : "border-transparent font-medium text-muted opacity-70",
              ].join(" ")}
              onClick={() => setValue(1)}
            >
              Sign up
            </button>
          </div>

          <div className="mb-1">
            {value === 0 ? (
              <LoginForm handleClose={handleClose} />
            ) : (
              <SignupForm handleClose={handleClose} />
            )}
          </div>

          <div className="relative my-4 border-t border-border text-center">
            <span className="relative top-[-0.7em] bg-surface px-2.5 text-xs lowercase text-muted">
              or
            </span>
          </div>

          <button
            type="button"
            className="h-11 w-full rounded-lg border border-border bg-bg font-sans text-[0.95rem] font-medium text-correct transition-colors hover:border-accent"
            onClick={handleGoogleSignIn}
          >
            Continue with Google
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AccountCircle;
