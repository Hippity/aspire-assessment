import React from "react";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  Container,
  Box,
  Button,
} from "@mui/material";
import Header from "./components/Header";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import { AuthProvider } from "./contexts/AuthContext";
import MainBody from "./components/MainBody";

// Create a theme
const theme = createTheme({});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <SnackbarProvider>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <Header />
            <Box sx={{ flexGrow: 1 }}>
              <MainBody />
            </Box>
          </Box>
        </SnackbarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
