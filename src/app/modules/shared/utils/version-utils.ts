import * as gitVersion from '../../../../../git-version.json';
import {Version} from "../model/version";

declare var System: any;

export const VersionInfo = async () => {
	try {
		const versionInfo = gitVersion;
		return new Version(versionInfo.version, versionInfo.hash);
	} catch(e) {
		return new Version('0.0.0', '0000000');
	}
}
