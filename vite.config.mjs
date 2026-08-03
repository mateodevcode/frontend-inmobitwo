import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    host: "0.0.0.0",
    proxy: {
      // Ejemplo:
      // "/api": {
      //   target: "http://localhost:8000",
      //   changeOrigin: true,
      // },
    },
    allowedHosts: [
      "https://extensions-activation-bathroom-shop.trycloudflare.com",
      "192.168.41.72",
    ],
  },

  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
