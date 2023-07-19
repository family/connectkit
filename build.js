/*
 * This script is used to copy over the version number in the package.json to
 * the CONNECTKIT_VERSION constant in the index.ts file. This is done to
 * ensure that the version number attribute on the ConnectKit wrapper is always
 * up to date with the version number in the package.json file.
 */

const fs = require('fs');
const config = require('./packages/connectkit/package.json');

const file = fs.readFileSync('packages/connectkit/src/index.ts', 'utf8');
const lines = file.split('\n');
const versionLine = lines.findIndex((line) =>
  line.includes('export const CONNECTKIT_VERSION = ')
);
lines[versionLine] = `export const CONNECTKIT_VERSION = '${config.version}';`;

fs.writeFileSync('packages/connectkit/src/index.ts', lines.join('\n'), 'utf8');
