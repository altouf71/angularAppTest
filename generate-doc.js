import fs from "fs";
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini"; // cheaper default
const MAX_FILES = parseInt(process.env.DOC_MAX_FILES || "200", 10); // safety cap
const MAX_CODE_CHARS_PER_FILE = 12000; // avoid huge prompts
const CONCURRENCY = parseInt(process.env.DOC_CONCURRENCY || "3", 10);

if (!apiKey) {
  console.error("❌ ERROR: OPENAI_API_KEY is missing.");
  process.exit(1);
}

const client = new OpenAI({ apiKey });

// Load scanned file chunks
const scanFile = "scan-output.json";
if (!fs.existsSync(scanFile)) {
  console.error("❌ ERROR: scan-output.json not found. Run code-scanner.js first.");
  process.exit(1);
}

const chunks = JSON.parse(fs.readFileSync(scanFile, "utf-8"));
console.log(`📄 Loaded ${chunks.length} file chunks.`);

// -----------------------------
// Group chunks by file
// -----------------------------
const fileMap = new Map();

for (const chunk of chunks) {
  if (!fileMap.has(chunk.filePath)) {
    fileMap.set(chunk.filePath, []);
  }
  fileMap.get(chunk.filePath).push(chunk);
}

// Normalize + sort chunks per file by chunkIndex
const files = [...fileMap.entries()].map(([filePath, fileChunks]) => {
  fileChunks.sort((a, b) => a.chunkIndex - b.chunkIndex);
  return { filePath, chunks: fileChunks };
});

// Optional: limit how many files to process
const limitedFiles = files.slice(0, MAX_FILES);
console.log(`🗂️ Preparing to document ${limitedFiles.length} files (cap = ${MAX_FILES}).`);

// -----------------------------
// Global flags
// -----------------------------
let QUOTA_EXCEEDED = false;

// -----------------------------
// GPT wrapper with quota handling
// -----------------------------
async function safeGPTCall(prompt) {
  if (QUOTA_EXCEEDED) {
    console.warn("⚠️ Skipping GPT call because quota was exceeded previously.");
    return "(Skipped due to quota limit)";
  }

  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }]
    });

    return response.choices[0].message.content;

  } catch (err) {
    if (
      err.code === "insufficient_quota" ||
      err.code === "rate_limit_exceeded" ||
      err.status === 429
    ) {
      console.error("\n❌ QUOTA/RATE LIMIT ERROR DETECTED!");
      console.error("⚠️ Details:", err.code || err.status, err.message);
      console.warn("➡️ The script will continue WITHOUT further API calls.");
      QUOTA_EXCEEDED = true;
      return "(Skipped due to insufficient quota)";
    }

    console.error("❌ Unexpected GPT error:", err);
    return "(Error during GPT processing)";
  }
}

// -----------------------------
// Build single file prompt
// -----------------------------
function buildFilePrompt(filePath, chunksForFile) {
  let combinedCode = "";
  for (const c of chunksForFile) {
    const label = `// [chunk ${c.chunkIndex + 1}/${c.totalChunks}]`;
    const block = `${label}\n${c.content}\n\n`;
    if ((combinedCode + block).length > MAX_CODE_CHARS_PER_FILE) {
      combinedCode += "\n// [truncated due to size limit]\n";
      break;
    }
    combinedCode += block;
  }

  return `
You are an AI Documentation Agent working on an Angular / TypeScript / JavaScript / HTML / CSS codebase.

Analyze the following **single source file** and produce **FILE-LEVEL documentation only**:

1. Short description of the file's purpose.
2. Key functions, classes, or components and what they do.
3. Inputs / outputs (props, parameters, return values, events, main side effects).
4. Dependencies (other modules, services, components, APIs).
5. Inferred functional requirements / behavior (what this file is responsible for).
6. At least 2 user stories, formatted exactly as:
   - "As a [role], I want [feature], so that [benefit]."
7. Anything missing or risky (TODOs, missing validation, lack of error handling, etc.)

Be concise but clear. Focus on **business behavior** and **Angular/frontend patterns** where relevant.

---

FILE: ${filePath}

CODE:
${combinedCode}
`;
}

// -----------------------------
// Analyze one file
// -----------------------------
async function analyzeFile(file) {
  const prompt = buildFilePrompt(file.filePath, file.chunks);
  const result = await safeGPTCall(prompt);
  return result;
}

// -----------------------------
// Process files with limited concurrency
// -----------------------------
async function processFilesInBatches(files, concurrency) {
  const results = [];
  let index = 0;

  async function worker() {
    while (index < files.length) {
      const currentIndex = index++;
      const file = files[currentIndex];

      console.log(`🔍 Processing ${file.filePath} (${currentIndex + 1}/${files.length})...`);

      const doc = await analyzeFile(file);
      results[currentIndex] = { file, doc };
      if (QUOTA_EXCEEDED) {
        // Stop quickly if quota died
        break;
      }
    }
  }

  const workers = [];
  const workerCount = Math.min(concurrency, files.length);
  for (let i = 0; i < workerCount; i++) {
    workers.push(worker());
  }

  await Promise.all(workers);
  return results;
}

// -----------------------------
// Main
// -----------------------------
async function run() {
  console.log("🚀 Starting GPT documentation generator...");

  const processed = await processFilesInBatches(limitedFiles, CONCURRENCY);

  let docsOutput = [];
  let storiesOutput = [];

  for (const entry of processed) {
    if (!entry) continue;
    const { file, doc } = entry;

    docsOutput.push(`### File: ${file.filePath}\n\n${doc}\n\n`);

    if (typeof doc === "string") {
      const stories = doc.match(/As a .*?\./g);
      if (stories) storiesOutput.push(...stories);
    }
  }

  // Ensure docs folder exists
  if (!fs.existsSync("docs")) {
    fs.mkdirSync("docs");
  }

  fs.writeFileSync("docs/module-docs.md", docsOutput.join("\n"));
  fs.writeFileSync("docs/user-stories.md", storiesOutput.join("\n"));

  console.log("✨ Documentation generated successfully!");
  console.log("📁 Output files:");
  console.log(" - docs/module-docs.md");
  console.log(" - docs/user-stories.md");

  if (QUOTA_EXCEEDED) {
    console.log("⚠️ Completed with quota limitations. Some files were skipped or summarized minimally.");
  }
}

run();
