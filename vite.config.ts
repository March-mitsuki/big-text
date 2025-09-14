import { pages } from "vike-cloudflare";
import react from "@vitejs/plugin-react";
import vike from "vike/plugin";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vike(), react(), pages()],
  build: {
    target: "es2022",
  },
  server: {
    host: "0.0.0.0",
  },
});
