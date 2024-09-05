import { crx, defineManifest } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

const manifest = defineManifest({
  manifest_version: 3,
  name: "chrome-extension-template",
  version: "1.0.0",
  action: {
    default_popup: "index.html",
  },
  content_scripts: [
    {
      matches: ["https://*/*"],
      js: ["src/contentScript/script.ts"],
    },
  ],
  background: {
    service_worker: "src/background/index.ts",
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const server = command === 'build' ? undefined : {
    port: 5174,
    strictPort: true,
    hmr: {
      port: 5174,
    },
  }

  return {
    plugins: [react(), crx({ manifest })],
    server,
  }
});
