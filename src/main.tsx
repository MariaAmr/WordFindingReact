import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./app/store.ts";
import { BrowserRouter } from "react-router-dom";
import { StyledEngineProvider } from "@mui/material";
import { CssBaseline } from "@mui/material";

// Mobile viewport height fix
document.documentElement.style.setProperty(
  "--vh",
  `${window.innerHeight * 0.01}px`
);
window.addEventListener("resize", () => {
  document.documentElement.style.setProperty(
    "--vh",
    `${window.innerHeight * 0.01}px`
  );
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <CssBaseline />
      <Provider store={store}>
        <BrowserRouter basename="/">
          <App />
        </BrowserRouter>
      </Provider>
    </StyledEngineProvider>
  </StrictMode>
);
