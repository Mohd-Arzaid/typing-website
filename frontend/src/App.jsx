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
    <>
      <ToastContainer theme={toastTheme} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user" element={<UserPage />} />
      </Routes>
    </>
  );
}

export default App;
