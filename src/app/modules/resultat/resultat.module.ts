import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListeResultat } from './liste-resultat/liste-resultat';
import { ResultatRoutingModule } from "./resultat-routing.module";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { RippleModule } from "primeng/ripple";
import { TooltipModule } from "primeng/tooltip";
import { DetailResultat } from "./detail-resultat/detail-resultat";
import { DialogModule } from "primeng/dialog";
import { ToolbarModule } from 'primeng/toolbar';
import { BureauVoteResultatComponent } from 'src/app/modules/resultat/bureau-vote-resultat/bureau-vote-resultat.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { InputTextModule } from 'primeng/inputtext';
import {ProgressSpinnerModule} from "primeng/progressspinner";
import { ToastModule } from 'primeng/toast';

@NgModule({
	declarations: [
		ListeResultat,
		DetailResultat,
		BureauVoteResultatComponent
	],
	imports: [
		CommonModule,
		ResultatRoutingModule,
		TableModule,
		ButtonModule,
		RippleModule,
		TooltipModule,
		DialogModule,
		ToolbarModule,
		SharedModule,
		InputTextModule,
		ProgressSpinnerModule,
		ToastModule
	]
})

export class ResultatModule {}
