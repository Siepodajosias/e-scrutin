import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginModule } from './modules/login/login.module';
import { DashbordModule } from './modules/dashbord/dashbord.module';
import { ParticipationModule } from './modules/participation/participation.module';
import { ResultatModule } from './modules/resultat/resultat.module';
import { CarteInteractiveModule } from './modules/carte-interactive/carte-interactive.module';
import { SharedModule } from './modules/shared/shared.module';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ApiUrlInterceptor } from './modules/shared/interceptors/api-url.interceptor';
import { JwtInterceptor } from './modules/shared/interceptors/jwt.interceptor';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export function tokenGetter(): string {
	const token = localStorage.getItem('token');
	return token ? token : '';
}

@NgModule({
	declarations: [
		AppComponent,
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		LoginModule,
		DashbordModule,
		ParticipationModule,
		ResultatModule,
		CarteInteractiveModule,
		SharedModule,
		HttpClientModule,
		JwtModule.forRoot({
			config: { tokenGetter: tokenGetter }
		}),
		ToastModule,
		TableModule,
		ButtonModule,
	],
	providers: [
		JwtHelperService,
		{ provide: HTTP_INTERCEPTORS, useClass: ApiUrlInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
		MessageService
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
