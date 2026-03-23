const {
  DEFAULT_IGNORE_CONFIG_PATH,
  DEFAULT_DESTINATION_ROOT,
  DEFAULT_SOURCE_ROOT,
  convertSkills,
} = require("./lib/ecc-to-cursor");

function readOption(flag, fallbackValue) {
  const index = process.argv.indexOf(flag);
  if (index === -1 || index === process.argv.length - 1) {
    return fallbackValue;
  }

  return process.argv[index + 1];
}

const sourceRoot = process.argv[2] || DEFAULT_SOURCE_ROOT;
const destinationRoot = process.argv[3] || DEFAULT_DESTINATION_ROOT;
const ignoreConfigPath = readOption("--ignore-config", DEFAULT_IGNORE_CONFIG_PATH);
const clean = process.argv.includes("--clean");
const converted = convertSkills({ sourceRoot, destinationRoot, ignoreConfigPath, clean });

console.log(JSON.stringify({
  sourceRoot,
  destinationRoot,
  ignoreConfigPath,
  count: converted.length,
}, null, 2));
