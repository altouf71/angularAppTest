import fs from "fs";
import path from "path";

const ROOT = process.cwd();

// Only these extensions
const INCLUDED_EXTENSIONS = [".ts", ".js", ".html", ".css", ".scss"];

// Skip these directories completely
const EXCLUDED_DIRS = [
  "node_modules",
  ".git",
  "dist",
  "build",
  "coverage",
  ".angular",
  "tmp",
  "out",
];

// Chunk size in characters (not tokens)
const MAX_CHARS_PER_CHUNK = 4000;

function isExcludedDir(dirName) {
  return EXCLUDED_DIRS.includes(dirName);
}

function shouldIncludeFile(filePath) {
  const ext = path.extname(filePath);
  if (!INCLUDED_EXTENSIONS.includes(ext)) return false;

  const normalized = filePath.replace(/\\/g, "/");

  // Skip tests/specs and auto-generated stuff
  if (normalized.endsWith(".spec.ts")) return false;
  if (normalized.endsWith(".test.ts")) return false;
  if (normalized.includes("/generated/")) return false;
  if (normalized.includes("/auto/")) return false;
  if (normalized.includes("/environment.")) return false;

  return true;
}

function walkDir(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!isExcludedDir(entry.name)) {
        walkDir(fullPath, fileList);
      }
    } else if (entry.isFile()) {
      const rel = path.relative(ROOT, fullPath);
      if (shouldIncludeFile(rel)) {
        fileList.push(fullPath);
      }
    }
  }

  return fileList;
}

function chunkContent(content) {
  const chunks = [];
  let index = 0;

  while (index < content.length) {
    const end = index + MAX_CHARS_PER_CHUNK;
    chunks.push(content.slice(index, end));
    index = end;
  }

  return chunks;
}

function main() {
  console.log("🔎 Scanning project for relevant source files...");

  const files = walkDir(ROOT);
  console.log(`📁 Found ${files.length} files to include.`);

  const allChunks = [];
  let chunkCount = 0;

  for (const filePath of files) {
    const relPath = path.relative(ROOT, filePath).replace(/\\/g, "/");
    const content = fs.readFileSync(filePath, "utf-8");

    // Skip empty / trivial files
    if (!content.trim()) continue;

    const chunks = chunkContent(content);
    const totalChunks = chunks.length;

    chunks.forEach((chunkContent, index) => {
      allChunks.push({
        filePath: relPath,
        chunkIndex: index,
        totalChunks,
        content: chunkContent,
      });
      chunkCount++;
    });
  }

  fs.writeFileSync("scan-output.json", JSON.stringify(allChunks, null, 2));
  console.log(`✅ Scan complete. ${chunkCount} chunks written to scan-output.json.`);
}

main();
