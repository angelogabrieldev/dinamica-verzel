import { Outlet } from "react-router-dom";
import { Box, AppBar, Toolbar, Typography, Container } from "@mui/material";

export default function MainLayout() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            <span style={{ fontWeight: 800 }}>Verzel</span> Conciliação
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 4, width: "100%" }}>
        <Outlet />
      </Box>
    </Box>
  );
}
