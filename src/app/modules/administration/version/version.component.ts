import { Component, OnInit } from '@angular/core';
import { VersionService } from 'src/app/modules/shared/service/version.service';
import { Version } from 'src/app/modules/shared/model/version';
import {VersionInfo} from '../../shared/utils/version-utils';
import {log} from "echarts/types/src/util/log";

@Component({
	selector: 'app-version',
	templateUrl: './version.component.html',
	styleUrls: ['./version.component.scss']
})
export class VersionComponent implements OnInit {
	versionBackend: Version;
	versionFrontend: Version;
	loading: boolean;

	constructor(private versionService: VersionService) {
	}

	ngOnInit(): void {
        this.recupererVersionBackend();
		VersionInfo().then(
			(value) => {
				this.versionFrontend = value
			}
		)
	}

	/**
	 * Récupère la version et le sha1 de l'application backend.
	 * @private
	 */
	private recupererVersionBackend(): void {
		this.loading = true;
		this.versionService.recupererVersionBackend().subscribe({
			next: (version) => {
				this.versionBackend = version;
			},
			error: (err) => {

			}
		});
	}
}
