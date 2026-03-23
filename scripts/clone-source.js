const { execFileSync } = require("child_process");
const path = require("path");
const {
  DEFAULT_REPO_URL,
  DEFAULT_SOURCE_ROOT,
  pathExists,
} = require("./lib/ecc-to-cursor");

const repoUrl = process.argv[2] || DEFAULT_REPO_URL;
const targetDir = path.resolve(process.argv[3] || DEFAULT_SOURCE_ROOT);

if (pathExists(targetDir)) {
  console.log(`Source already exists: ${targetDir}`);
  process.exit(0);
}

execFileSync("git", ["clone", repoUrl, targetDir], {
  stdio: "inherit",
});

console.log(`Cloned ${repoUrl} -> ${targetDir}`);
