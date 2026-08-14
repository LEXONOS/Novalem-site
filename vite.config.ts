import { defineConfig } from "vite";

// Site statique, deployable tel quel sur OVH (FileZilla) ou Vercel.
// base "./" => chemins relatifs, fonctionne dans n'importe quel sous-dossier d'hebergement.
export default defineConfig({
  base: "./",
  build: {
    target: "es2020",
    cssCodeSplit: false,
    assetsInlineLimit: 2048,
  },
});
