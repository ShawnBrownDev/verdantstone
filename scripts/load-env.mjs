import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function parseEnvFile(content) {
  const entries = [];
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex === -1) continue;
    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    entries.push([key, value]);
  }
  return entries;
}

export function loadProjectEnv() {
  const candidateFiles = [".env.local", ".env"];

  for (const filename of candidateFiles) {
    const path = resolve(process.cwd(), filename);
    if (!existsSync(path)) continue;
    const entries = parseEnvFile(readFileSync(path, "utf8"));
    for (const [key, value] of entries) {
      if (process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  }
}
