import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { TableauDeBord } from './tableau-de-bord/tableau-de-bord';
import { DashbordRoutingModule } from './dashbord-routing.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { SharedModule } from '../shared/shared.module';
import { TabViewModule } from 'primeng/tabview';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { CountUpDirective } from 'src/app/modules/shared/directives/count';

@NgModule({
	declarations: [
		TableauDeBord, CountUpDirective
	],
	imports: [
		CommonModule,
		TableModule,
		DashbordRoutingModule,
		ProgressBarModule,
		NgApexchartsModule,
		ProgressSpinnerModule,
		SharedModule,
		TabViewModule,
		DividerModule,
		ToastModule
	],
	providers: [
		DecimalPipe
	]
})
export class DashbordModule {
}
