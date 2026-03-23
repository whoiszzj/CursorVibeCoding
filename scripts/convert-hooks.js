const {
  DEFAULT_DESTINATION_ROOT,
  DEFAULT_SOURCE_ROOT,
  convertHooks,
} = require("./lib/ecc-to-cursor");

const sourceRoot = process.argv[2] || DEFAULT_SOURCE_ROOT;
const destinationRoot = process.argv[3] || DEFAULT_DESTINATION_ROOT;
const clean = process.argv.includes("--clean");
const converted = convertHooks({ sourceRoot, destinationRoot, clean });

console.log(JSON.stringify({
  sourceRoot,
  destinationRoot,
  count: converted.length,
}, null, 2));
