// main.tsx
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { BrowserRouter } from "react-router-dom";
import { StyledEngineProvider } from "@mui/material";
import { CssBaseline } from "@mui/material";

const useViewportHeight = () => {
  useEffect(() => {
    const updateViewportHeight = () => {
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`
      );
    };

    updateViewportHeight();
    window.addEventListener("resize", updateViewportHeight);
    return () => window.removeEventListener("resize", updateViewportHeight);
  }, []);
};

const RootComponent = () => {
  useViewportHeight(); // Custom hook for viewport management

  return (
    <StyledEngineProvider injectFirst>
      <CssBaseline />
      <Provider store={store}>
        <BrowserRouter basename="/">
          <App />
        </BrowserRouter>
      </Provider>
    </StyledEngineProvider>
  );
};

// Export for testing purposes
export { RootComponent };

// Main render
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootComponent />
  </StrictMode>
);
