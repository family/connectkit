/*
 * This script is used to copy over the version number in the package.json to
 * the OPENFORT_VERSION constant in the index.ts file. This is done to
 * ensure that the version number attribute on the Openfort wrapper is always
 * up to date with the version number in the package.json file.
 */

const fs = require('node:fs')
const config = require('./packages/openfort-react/package.json')

const file = fs.readFileSync('packages/openfort-react/src/version.ts', 'utf8')
const lines = file.split('\n')
const versionLine = lines.findIndex((line) => line.includes('export const OPENFORT_VERSION = '))
lines[versionLine] = `export const OPENFORT_VERSION = '${config.version}';`

fs.writeFileSync('packages/openfort-react/src/version.ts', lines.join('\n'), 'utf8')
