import pkg from "./package.json";
import { defineConfig } from "vite";
import ssl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
  base: "./",
  plugins: [
    react({
      jsxRuntime: "classic",
    }),
    ssl(),
    cssInjectedByJsPlugin(),
  ],
  build: {
    copyPublicDir: false,
    minify: "terser",
  },
});
