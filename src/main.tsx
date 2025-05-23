import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "@/App.tsx";
import StoreProvider from "@/providers/StoreProvider.tsx";
import { BrowserRouter, Routes, Route } from "react-router";
import "@/i18n/i18n.js";
import { SonnerToaster } from "@/components/ui/sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" index element={<App />} />
        </Routes>
      </BrowserRouter>
      <SonnerToaster position="top-center" />
    </StoreProvider>
  </StrictMode>
);
