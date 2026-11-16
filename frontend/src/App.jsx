import { ThemeProvider } from "styled-components";

import { GlobalStyles } from "./Styles/global";
import { useTheme } from "./Context/ThemeContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "./Pages/HomePage";
import { Route, Routes } from "react-router-dom";
import UserPage from "./Pages/UserPage";

function App() {
  const { theme } = useTheme();
  const toastTheme = theme.background === "#ffffff" ? "light" : "dark";

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer theme={toastTheme} />
      <GlobalStyles />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user" element={<UserPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
