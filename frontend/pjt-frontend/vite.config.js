// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    global: "globalThis", // 'globalThis'를 사용하여 브라우저 환경에서 'global'을 정의합니다.
  },
});
