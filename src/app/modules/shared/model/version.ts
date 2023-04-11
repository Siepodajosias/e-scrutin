export class Version {
	version: string
	sha1: string


	constructor(version: string, sha1: string) {
		this.version = version;
		this.sha1 = sha1;
	}
}
