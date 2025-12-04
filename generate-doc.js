import fs from "fs";
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

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

let documentation = [];
let userStories = [];
let featureMap = [];

// Function to call GPT for each chunk
async function analyzeChunk(chunk) {
  const prompt = `
You are an AI Documentation Agent.

Analyze the following code chunk and produce:

1. Purpose of file
2. Key functions and descriptions
3. Input/Output summary
4. Dependencies
5. Functional requirements inferred from the code
6. At least 2 user stories formatted as:
   "As a [role], I want [feature], so that [benefit]."
7. Anything missing or undocumented

---

FILE: ${chunk.filePath}
CHUNK #${chunk.chunkIndex}

CODE:
${chunk.content}
`;

  const response = await client.chat.completions.create({
    model: "gpt-4.1",
    messages: [{ role: "user", content: prompt }]
  });

  return response.choices[0].message.content;
}

async function run() {
  console.log("🚀 Starting GPT documentation generator...");

  let docsOutput = [];
  let storiesOutput = [];

  for (const chunk of chunks) {
    console.log(`🔍 Processing ${chunk.filePath} (chunk ${chunk.chunkIndex})...`);

    const result = await analyzeChunk(chunk);

    // Save raw GPT output
    docsOutput.push(`### File: ${chunk.filePath} (chunk ${chunk.chunkIndex})\n\n${result}\n\n`);

    // Extract user stories (AI-friendly simple split)
    const stories = result.match(/As a .*?\./g);
    if (stories) storiesOutput.push(...stories);
  }

  // Ensure docs folder exists
  if (!fs.existsSync("docs")) {
    fs.mkdirSync("docs");
  }

  // Save documentation files
  fs.writeFileSync("docs/module-docs.md", docsOutput.join("\n"));
  fs.writeFileSync("docs/user-stories.md", storiesOutput.join("\n"));

  console.log("✨ Documentation generated successfully!");
  console.log("📁 Output files:");
  console.log(" - docs/module-docs.md");
  console.log(" - docs/user-stories.md");
}

run();
