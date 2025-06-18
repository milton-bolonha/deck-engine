#!/usr/bin/env node

/**
 * 🔄 DeckEngine Dashboard - Reset
 * Limpa tudo e recomeça
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("\n🔄 DeckEngine Dashboard - Reset");
console.log("==============================\n");

// Remove build files
console.log("🗑️  Removendo arquivos de build...");
try {
  if (fs.existsSync(".next")) {
    fs.rmSync(".next", { recursive: true });
    console.log("✅ .next removido");
  }

  if (fs.existsSync(".env.local")) {
    fs.unlinkSync(".env.local");
    console.log("✅ .env.local removido");
  }

  if (fs.existsSync("data/sample-data.json")) {
    fs.unlinkSync("data/sample-data.json");
    console.log("✅ dados de exemplo removidos");
  }
} catch (err) {
  console.log("⚠️  Alguns arquivos não puderam ser removidos");
}

console.log("\n🎉 Reset concluído!");
console.log("\n📋 Para reconfigurar:");
console.log("npm run setup");
console.log("npm run dev\n");
