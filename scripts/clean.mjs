import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targets = ["build", "lib", "logs", "public/css", "public/js", "tsconfig.tsbuildinfo"];

for (const target of targets) {
  fs.rmSync(path.join(root, target), { recursive: true, force: true });
  console.log(`removed ${target}`);
}
