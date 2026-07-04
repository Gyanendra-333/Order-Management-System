import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App";
import "./index.css";

import { OrderProvider } from "./context/OrderContext";
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <OrderProvider>
          <Toaster position="top-right" />
          <App />
        </OrderProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);