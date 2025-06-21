const nextJest = require("next/jest");

// Cria função de configuração usando diretório do projeto
const createJestConfig = nextJest({
  dir: "./",
});

// Configurações customizadas
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    // Mapas opcionais para static imports (ex.: CSS)
    "^.+\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
};

module.exports = createJestConfig(customJestConfig);
