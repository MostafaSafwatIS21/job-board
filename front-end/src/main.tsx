import { createRoot } from "react-dom/client";
import React from "react";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import "./index.css";
import { router } from "./routes";
import store from "./app/store";
import { TooltipProvider } from "@/components/ui/tooltip";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <TooltipProvider>
        <RouterProvider router={router} />
      </TooltipProvider>
    </Provider>
  </React.StrictMode>,
);
