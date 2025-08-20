// main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { BrowserRouter } from "react-router-dom";
import { StyledEngineProvider } from "@mui/material";
import { CssBaseline } from "@mui/material";


const RootComponent = () => {
  
  return (
    <StyledEngineProvider injectFirst>
      <CssBaseline />
      <Provider store={store}>
        <BrowserRouter>
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
