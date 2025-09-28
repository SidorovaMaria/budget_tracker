/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

const clientTestConfig = {
  displayName: "client",
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/__tests__/client/**/?(*.)+(spec|test).[jt]s?(x)"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  clearMocks: true,
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/$1" },
};
const serverTestConfig = {
  displayName: "server",
  testEnvironment: "node",
  testMatch: ["<rootDir>/__tests__/server/**/?(*.)+(spec|test).[jt]s?(x)"],
  clearMocks: true,

  moduleNameMapper: { "^@/(.*)$": "<rootDir>/$1" },
};
const config = {
  projects: [
    await createJestConfig(clientTestConfig)(),
    await createJestConfig(serverTestConfig)(),
  ],
};
export default config;
