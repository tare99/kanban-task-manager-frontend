import {defineConfig, type UserConfig} from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import {componentTagger} from "lovable-tagger";
import {nodePolyfills} from "vite-plugin-node-polyfills";

export default defineConfig(({mode}): UserConfig => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    nodePolyfills({
      protocolImports: true, // za node: prefiksane module ako ih koristiš
    }),
  ].filter(Boolean),
  define: {
    global: "globalThis",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
