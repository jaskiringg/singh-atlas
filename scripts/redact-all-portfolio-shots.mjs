#!/usr/bin/env node
/**
 * Rebuild all redacted portfolio shots from originals.
 */
import { execFileSync } from "node:child_process";
import path from "node:path";
import sharp from "sharp";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const store =
  "/Users/jaskiring/Library/Application Support/Cursor/AgentStores/cursor_agent_stores/bc-04b7c172-5844-4c07-9894-1d04e2b415fa/files";
const pulseSrc =
  "/Users/jaskiring/Library/Application Support/Cursor/User/globalStorage/anysphere.cursor-agent-worker/worker-data/cursor-agent-worker-6bfc70441b/projects/Users-jaskiring-Documents-mandi-bhai/assets/be4ccb9d-fc67-441b-9fcb-3e978f432025.png";

const shots = path.join(root, "public/shots");

function run(script, ...args) {
  execFileSync(process.execPath, [path.join(__dirname, script), ...args], { stdio: "inherit" });
}

async function webify(name) {
  const src = path.join(shots, `${name}.png`);
  await sharp(src)
    .resize({ width: 1400, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(path.join(shots, `${name}-web.png`));
}

const cokeSrc = path.join(store, "media/coke-buddy-products.png");
run("redact-coke-buddy-products.mjs", cokeSrc, path.join(shots, "salescode-coke-buddy-products.png"));
await webify("salescode-coke-buddy-products");
await sharp(path.join(shots, "salescode-coke-buddy-products.png")).resize({ width: 900, withoutEnlargement: true }).png().toFile(path.join(shots, "salescode-coke-buddy-web.png"));
await sharp(path.join(shots, "salescode-coke-buddy-products.png")).toFile(path.join(shots, "salescode-coke-buddy.png"));

run("redact-relive-pulse.mjs", pulseSrc, path.join(shots, "relive-pulse.png"));
await webify("relive-pulse");

const crmDir = path.join(store, "media/relivecure-crm");
for (const s of ["analytics", "marketing", "leads", "call-pipeline"]) {
  run("redact-relive-crm.mjs", s, path.join(crmDir, `${s}.png`), path.join(shots, `relive-${s}.png`));
  await webify(`relive-${s}`);
}

console.log("All portfolio shots redacted.");