import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue"
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "jsdom",
    deps: {
      inline: ['localforage']
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
   root: ".", //Define the root
});

