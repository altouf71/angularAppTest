const fs = require("fs");
const path = require("path");

const allowedExtensions = [
  ".cs", ".ts", ".html", ".css", ".json", ".sql"
];

const CHUNK_SIZE = 3000;

function scanDirectory(rootPath) {
  const results = [];

  function walk(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        walk(fullPath);
      } else {
        if (shouldScanFile(fullPath)) {
          const content = fs.readFileSync(fullPath, "utf-8");
          const chunks = splitIntoChunks(fullPath, content);
          results.push(...chunks);
        }
      }
    }
  }

  walk(rootPath);
  return results;
}

function shouldScanFile(filePath) {
  return allowedExtensions.includes(path.extname(filePath).toLowerCase());
}

function splitIntoChunks(filePath, content) {
  const chunks = [];

  for (let i = 0; i < content.length; i += CHUNK_SIZE) {
    chunks.push({
      filePath,
      chunkIndex: i / CHUNK_SIZE,
      content: content.substring(i, i + CHUNK_SIZE)
    });
  }

  return chunks;
}

// Run
const rootPath = process.argv[2] || "./";
const result = scanDirectory(rootPath);

fs.writeFileSync("scan-output.json", JSON.stringify(result, null, 2));
console.log("✨ Scan complete! Output saved to scan-output.json");
