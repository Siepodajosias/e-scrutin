import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { SidebarComponent } from './component/sidebar/sidebar.component';
import { SublevelMenuComponent } from './component/sidebar/sublevel-menu.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { HeaderComponent } from './component/header/header.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ReplacePipe } from './pipe/pipe-replace';
import { InputTextModule } from 'primeng/inputtext';
import { ResetPasswordComponent } from 'src/app/modules/shared/component/reset-password/reset-password.component';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PasswordModule } from 'primeng/password';
import { SlideMenuModule } from 'primeng/slidemenu';
import { ToastModule } from 'primeng/toast';
import {AvatarModule} from "primeng/avatar";
import {OverlayPanelModule} from "primeng/overlaypanel";
@NgModule({
	declarations: [
		SidebarComponent,
		SublevelMenuComponent,
		ResetPasswordComponent,
		HeaderComponent,
		ReplacePipe
	],
	exports: [
		SidebarComponent,
		HeaderComponent,
		ResetPasswordComponent,
		ReplacePipe,
		CurrencyPipe,
	],
	imports: [
		CommonModule,
		RouterLinkActive,
		TooltipModule,
		InputTextModule,
		RouterLink,
		RouterOutlet,
		MultiSelectModule,
		DropdownModule,
		ButtonModule,
		RippleModule,
		FormsModule,
		RadioButtonModule,
		DialogModule,
		MessageModule,
		ProgressSpinnerModule,
		PasswordModule,
		ReactiveFormsModule,
		SlideMenuModule,
		ToastModule,
		AvatarModule,
		OverlayPanelModule
	],
	providers: [
		ReplacePipe,
	]
})
export class SharedModule {
}
