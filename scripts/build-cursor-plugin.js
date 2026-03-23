const {
  DEFAULT_CONFIG_PATH,
  DEFAULT_DESTINATION_ROOT,
  DEFAULT_IGNORE_CONFIG_PATH,
  DEFAULT_SOURCE_ROOT,
  buildCursorPlugin,
  locateSourceDirectories,
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
const configPath = readOption("--config", DEFAULT_CONFIG_PATH);
const ignoreConfigPath = readOption("--ignore-config", DEFAULT_IGNORE_CONFIG_PATH);
const cleanDestination = !process.argv.includes("--no-clean");
const located = locateSourceDirectories(sourceRoot);

if (!located.isComplete) {
  console.error("Missing source directories:");
  console.error(JSON.stringify(located, null, 2));
  process.exit(1);
}

const result = buildCursorPlugin({
  sourceRoot,
  destinationRoot,
  configPath,
  ignoreConfigPath,
  cleanDestination,
});

console.log(JSON.stringify(result, null, 2));
