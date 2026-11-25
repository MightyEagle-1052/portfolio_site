import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { applySiteMeta } from "./site-meta.js";

// Dev-only: forward the admin dashboard and API so http://localhost:8080/admin works
// just like domain/admin does when the portfolio server serves everything.
const ADMIN_DEV = process.env.ADMIN_DEV_URL || "http://localhost:5174";
const API = process.env.API_URL || "http://localhost:4000";

const CONTENT_FILE = path.resolve(__dirname, "src/data/content.json");

/** Fill <title> and meta tags in index.html from content.json (dev server and static build). */
const siteMetaPlugin = () => ({
  name: "site-meta",
  transformIndexHtml: (html: string) => applySiteMeta(html, JSON.parse(fs.readFileSync(CONTENT_FILE, "utf8"))),
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // "/" when the portfolio server serves the site; the GitHub Pages workflow sets
  // BASE_PATH (e.g. "/portfolio_site/") because Pages serves it under the repo name.
  base: process.env.BASE_PATH || '/',
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/admin": { target: ADMIN_DEV, ws: true },
      "/api": API,
      "/site": API,
    },
  },
  plugins: [
    react(),
    siteMetaPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
