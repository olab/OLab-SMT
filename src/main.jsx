import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { RouterProvider } from "react-router-dom";
import { MaterialUIControllerProvider } from "@/context";
import 'regenerator-runtime/runtime';

// Material Dashboard 2 PRO React themes
import theme from "@/assets/theme";

import { router } from "./App";

// const theme = createTheme({
//   palette: {
//     primary: { main: "#3a34d2" },
//   },
// });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <MaterialUIControllerProvider>
        <CssBaseline>
          <RouterProvider router={router} />
        </CssBaseline>
      </MaterialUIControllerProvider>
    </ThemeProvider>
  </StrictMode>
);
