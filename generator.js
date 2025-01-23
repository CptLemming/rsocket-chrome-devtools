
const path = require("path");
const fs = require("fs");
const pbjs = require("protobufjs-cli/pbjs");
const pbts = require("protobufjs-cli/pbts");

const log = console.log;

const root = path.resolve(__dirname);
const input = path.resolve(root, "proto");
const out = path.resolve(root, "src", "generated");

/**
 * Generate JS and TS files from proto file
 * @param {string[]} files
 */
function generate(files = []) {
  log(`Generating JS`);
  pbjs.main(
    [
      "-t",
      "static-module",
      "-w",
      "es6",
      "--lint",
      " eslint-disable ",
      "-o",
      path.resolve(out, `api.js`),
      ...files.map(file => path.resolve(input, `${file}.proto`)),
    ],
    function pbjsOutput(err) {
      if (err) throw err;

      log(`Generating JS - done`);
      log(`Generating TS`);

      pbts.main(["-o", path.resolve(out, `api.d.ts`), path.resolve(out, `api.js`)], function pbtsOutput(err) {
        if (err) throw err;

        log(`Generating TS - done`);
      });
    },
  );
}

if (!fs.existsSync(out)) {
  fs.mkdirSync(out);
}
fs.readdirSync(out).forEach(file => {
  if (file !== ".gitignore") {
    fs.unlinkSync(path.join(out, file));
  }
});

const files = fs.readdirSync(input).map(file => {
  const filename = path.parse(file).name;
  return filename;
});

generate(files);
