import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { AppProviders } from "./app/providers";
import { router } from "./app/router";
import "./index.css";

// Função para iniciar o MSW antes do React
async function enableMocking() {
  const { worker } = await import("./mocks/browser");
  return worker.start();
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </React.StrictMode>
  );
});