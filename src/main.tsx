import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { FilterProvider } from "./components/FilterContext";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FilterProvider>
      {" "}
      <App />
    </FilterProvider>
  </StrictMode>
);
