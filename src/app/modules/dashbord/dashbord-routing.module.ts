import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TableauDeBord} from "./tableau-de-bord/tableau-de-bord";

const routes: Routes = [
	{
		path: '', component: TableauDeBord
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class DashbordRoutingModule {
}
