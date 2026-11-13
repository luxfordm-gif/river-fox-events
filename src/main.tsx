import { createRoot } from "react-dom/client";
import App, { preloadRoute } from "./App.tsx";
import "./index.css";
import { installClickTracking } from "./lib/track";

installClickTracking();

// The prerendered HTML stays on screen while this page's own code downloads;
// React takes over only once it's here, so the page never blanks or flickers.
const start = () => createRoot(document.getElementById("root")!).render(<App />);
preloadRoute(window.location.pathname).then(start, start);
