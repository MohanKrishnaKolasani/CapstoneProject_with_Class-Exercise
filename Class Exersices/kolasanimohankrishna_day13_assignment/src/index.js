import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";
import { ThemeProvider } from "./challenge5/ThemeContext";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { Provider } from "react-redux";
import { store } from "./challenge8/store";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

serviceWorkerRegistration.register();