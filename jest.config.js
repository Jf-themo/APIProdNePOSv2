module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/*.test.ts", "**/*.spec.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  collectCoverageFrom: [
    "src/services/**/*.ts",
    "src/middleware/**/*.ts",
    "src/utils/validators/**/*.ts",
    "src/controllers/**/*.ts"
  ],
  coverageDirectory: "coverage",
  verbose: true,
  testTimeout: 10000,
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
  moduleNameMapper: {
    "^axios$": "<rootDir>/src/__tests__/__mocks__/axios.ts"
  }
};