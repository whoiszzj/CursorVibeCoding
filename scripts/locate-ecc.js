const {
  DEFAULT_SOURCE_ROOT,
  locateSourceDirectories,
} = require("./lib/ecc-to-cursor");

const sourceRoot = process.argv[2] || DEFAULT_SOURCE_ROOT;
const result = locateSourceDirectories(sourceRoot);

console.log(JSON.stringify(result, null, 2));

if (!result.isComplete) {
  process.exitCode = 1;
}
