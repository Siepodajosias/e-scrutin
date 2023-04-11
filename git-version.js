const { writeFileSync } = require('fs');
const { execSync } = require('child_process');

const appVersion = require('./package.json').version;
const appHash = execSync("git rev-parse HEAD").toString().replace(/\n/g, '')

let versionInfoJson = {
	version: appVersion,
	hash: appHash
}
console.log(`version: '${ appVersion }', sha1: '${ appHash }'`);
writeFileSync('git-version.json', JSON.stringify(versionInfoJson));
