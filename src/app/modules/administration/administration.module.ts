import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrationRoutingModule } from 'src/app/modules/administration/administration-routing.module';
import { UtilisateurComponent } from 'src/app/modules/administration/utilisateur/utilisateur.component';
import { VersionComponent } from 'src/app/modules/administration/version/version.component';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessagesModule } from 'primeng/messages';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RippleModule } from 'primeng/ripple';
import { ConfirmationService } from 'primeng/api';
import { UtilisateurModal } from 'src/app/modules/administration/utilisateur/utilisateur-modal/utilisateur-modal';
import { PanelModule } from 'primeng/panel';
import { TooltipModule } from 'primeng/tooltip';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TagModule } from "primeng/tag";

@NgModule({
	declarations: [
		UtilisateurComponent,
		VersionComponent,
		UtilisateurModal,
	],
	imports: [
		CommonModule,
		AdministrationRoutingModule,
		TableModule,
		ToastModule,
		DialogModule,
		ReactiveFormsModule,
		InputTextModule,
		DropdownModule,
		FormsModule,
		ProgressSpinnerModule,
		ConfirmDialogModule,
		RippleModule,
		MessagesModule,
		PanelModule,
		TooltipModule,
		InputSwitchModule,
		TagModule
	],
	providers: [ConfirmationService]
})
export class AdministrationModule {
}
