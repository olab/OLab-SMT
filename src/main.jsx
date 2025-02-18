import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import CssBaseline from "@mui/material/CssBaseline";
import { RouterProvider } from "react-router-dom";
import { MaterialUIControllerProvider } from "@/context";
import "regenerator-runtime/runtime";

// Material Dashboard 2 PRO React themes
import theme from "@/assets/theme";

import { router } from "./App";

createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <MaterialUIControllerProvider>
      <CssBaseline>
        <RouterProvider router={router} />
      </CssBaseline>
    </MaterialUIControllerProvider>
  </ThemeProvider>
);
