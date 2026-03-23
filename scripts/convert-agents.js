const fs = require("fs");
const {
  DEFAULT_CONFIG_PATH,
  DEFAULT_DESTINATION_ROOT,
  DEFAULT_IGNORE_CONFIG_PATH,
  DEFAULT_SOURCE_ROOT,
  convertAgents,
} = require("./lib/ecc-to-cursor");

function normalizeText(content) {
  return `${String(content).replace(/\r\n/g, "\n").replace(/\s+$/u, "")}\n`;
}

function stripWrappingQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function parseScalar(value) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (trimmed === "true") {
    return true;
  }

  if (trimmed === "false") {
    return false;
  }

  if (trimmed === "null") {
    return null;
  }

  if (/^-?\d+$/u.test(trimmed)) {
    return Number(trimmed);
  }

  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return stripWrappingQuotes(trimmed);
    }
  }

  return stripWrappingQuotes(trimmed);
}

function parseFrontmatter(markdown) {
  const normalized = String(markdown).replace(/\r\n/g, "\n");

  if (!normalized.startsWith("---\n")) {
    return {
      attributes: {},
      body: normalized,
      hasFrontmatter: false,
    };
  }

  const closingIndex = normalized.indexOf("\n---\n", 4);
  if (closingIndex === -1) {
    return {
      attributes: {},
      body: normalized,
      hasFrontmatter: false,
    };
  }

  const rawFrontmatter = normalized.slice(4, closingIndex);
  const body = normalized.slice(closingIndex + 5);
  const attributes = {};

  for (const line of rawFrontmatter.split("\n")) {
    if (!line.trim()) {
      continue;
    }

    const match = line.match(/^([A-Za-z0-9_-]+):(.*)$/u);
    if (!match) {
      continue;
    }

    attributes[match[1]] = parseScalar(match[2]);
  }

  return {
    attributes,
    body,
    hasFrontmatter: true,
  };
}

function serializeFrontmatterValue(key, value) {
  if (Array.isArray(value)) {
    return `[${value.map(item => JSON.stringify(String(item))).join(", ")}]`;
  }

  if (typeof value === "boolean" || typeof value === "number") {
    return String(value);
  }

  if (key === "name" || key === "model" || key === "description") {
    return String(value);
  }

  return JSON.stringify(String(value));
}

function renderAgentFrontmatter(attributes) {
  const orderedAttributes = {};
  const rawName = String(attributes.name || "").trim();
  const normalizedName = rawName.replace(/^agent-/u, "");

  if (Array.isArray(attributes.tools) && attributes.tools.length > 0) {
    orderedAttributes.tools = attributes.tools;
  }

  orderedAttributes.name = `agent-${normalizedName}`;

  if (attributes.model !== undefined && attributes.model !== null && String(attributes.model).trim()) {
    orderedAttributes.model = String(attributes.model).trim();
  }

  if (
    attributes.description !== undefined &&
    attributes.description !== null &&
    String(attributes.description).trim()
  ) {
    orderedAttributes.description = String(attributes.description).trim();
  }

  for (const [key, value] of Object.entries(attributes)) {
    if (key === "tools" || key === "name" || key === "model" || key === "description") {
      continue;
    }

    if (value === undefined || value === null) {
      continue;
    }

    orderedAttributes[key] = value;
  }

  const lines = ["---"];

  for (const [key, value] of Object.entries(orderedAttributes)) {
    lines.push(`${key}: ${serializeFrontmatterValue(key, value)}`);
  }

  lines.push("---", "");
  return lines.join("\n");
}

function normalizeConvertedAgentFile(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const { attributes, body, hasFrontmatter } = parseFrontmatter(source);

  if (!hasFrontmatter) {
    return;
  }

  fs.writeFileSync(
    filePath,
    normalizeText(`${renderAgentFrontmatter(attributes)}${body}`),
  );
}

function readOption(flag, fallbackValue) {
  const index = process.argv.indexOf(flag);
  if (index === -1 || index === process.argv.length - 1) {
    return fallbackValue;
  }

  return process.argv[index + 1];
}

const sourceRoot = process.argv[2] || DEFAULT_SOURCE_ROOT;
const destinationRoot = process.argv[3] || DEFAULT_DESTINATION_ROOT;
const configPath = readOption("--config", DEFAULT_CONFIG_PATH);
const ignoreConfigPath = readOption("--ignore-config", DEFAULT_IGNORE_CONFIG_PATH);
const clean = process.argv.includes("--clean");
const converted = convertAgents({
  sourceRoot,
  destinationRoot,
  configPath,
  ignoreConfigPath,
  clean,
});

for (const item of converted) {
  normalizeConvertedAgentFile(item.output);
}

console.log(JSON.stringify({
  sourceRoot,
  destinationRoot,
  configPath,
  ignoreConfigPath,
  count: converted.length,
}, null, 2));
