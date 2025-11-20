import { build } from "bun";
import { cpSync, rmSync, mkdirSync } from "node:fs";

console.log("Building extension...");

// Clean dist
rmSync("dist", { recursive: true, force: true });
mkdirSync("dist");

// Build background
await build({
    entrypoints: ["src/background/background.ts"],
    outdir: "dist/background",
    target: "browser",
});

// Build content
await build({
    entrypoints: ["src/content/content.ts"],
    outdir: "dist/content",
    target: "browser",
});

// Copy public files
cpSync("public", "dist", { recursive: true });

console.log("Build complete! Output in ./dist");
