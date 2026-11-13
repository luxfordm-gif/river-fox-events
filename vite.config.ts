import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Scheduled journal articles: live (Netlify "production") builds leave out
// anything dated after today, UK time. Previews and local builds show all.
// Same rule as scripts/schedule.mjs, which the prerender and postbuild use.
const BUILD_DATE = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/London",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  define: {
    __BUILD_DATE__: JSON.stringify(BUILD_DATE),
    __HIDE_SCHEDULED__: JSON.stringify(process.env.CONTEXT === "production"),
  },
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  build: {
    // One stylesheet for the whole site, as before the page split: split
    // styles load in a different order and change which rule wins (the
    // Christmas headline lost its script face). It's ~25KB and cached once.
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        // Pages load their own code (speed pass, 2026-11-13). Without this the
        // split leaves dozens of tiny files (some just one photo's address);
        // fold anything under 10KB into the files that use it.
        experimentalMinChunkSize: 10_000,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
}));
