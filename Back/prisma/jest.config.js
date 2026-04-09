/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/__tests__"],
  testMatch: ["**/*.test.ts"],
  moduleNameMapper: {
    "^../config/database$": "<rootDir>/__tests__/helpers/prismaMock.ts",
    "^../../config/database$": "<rootDir>/__tests__/helpers/prismaMock.ts",
  },
};
