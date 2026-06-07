import dotenv from 'dotenv';
import { defineConfig, devices } from "@playwright/test";
dotenv.config({ path: '../Frontend/.env' });

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: process.env.VITE_API_URL || "http://localhost:5173",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    cwd: "../Frontend",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});
