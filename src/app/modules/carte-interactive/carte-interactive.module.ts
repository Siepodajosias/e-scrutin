import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CarteInteractive} from './carte-interactive/carte-interactive';
import {CarteInteractiveRoutingModule} from './carte-interactive-routing.module';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import { DetailResulatComponent } from './detail-resulat/detail-resulat.component';
import {DialogModule} from "primeng/dialog";
import {ButtonModule} from "primeng/button";
import {BlockUIModule} from "primeng/blockui";
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {RadioButtonModule} from 'primeng/radiobutton';
import {SharedModule} from "../shared/shared.module";

@NgModule({
	declarations: [
		CarteInteractive,
  DetailResulatComponent
	],
    imports: [
        CommonModule,
        CarteInteractiveRoutingModule,
        MessagesModule,
        MessageModule,
        DialogModule,
        ButtonModule,
        BlockUIModule,
        ProgressSpinnerModule,
        RadioButtonModule,
        SharedModule
    ],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CarteInteractiveModule {
}
