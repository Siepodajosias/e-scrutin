import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListeParticipation } from './liste-participation/liste-participation';
import { ParticipationRoutingModule } from './participation-routing.module';
import { DetailParticipation } from './detail-participation/detail-participation';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { SharedModule } from '../shared/shared.module';
import { ToastModule } from 'primeng/toast';


@NgModule({
	declarations: [
		ListeParticipation,
		DetailParticipation
	],
	imports: [
		CommonModule,
		ParticipationRoutingModule,
		TabViewModule,
		TableModule,
		DialogModule,
		TagModule,
		ButtonModule,
		InputTextModule,
		TooltipModule,
		RippleModule,
		SharedModule,
		ToastModule
	]
})
export class ParticipationModule {
}
