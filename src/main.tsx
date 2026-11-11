import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { installClickTracking } from "./lib/track";

installClickTracking();

createRoot(document.getElementById("root")!).render(<App />);
