import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";

import MainLayout from "./layouts/MainLayout";
import StoreList from "./pages/StoreList"
import Conciliacao from "./pages/conciliacao/Conciliacao"

export default function App() {
  const theme = createTheme({
    palette: {
      mode: "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<StoreList />} />
            <Route path="/conciliacao" element={<Conciliacao />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
