import {Component, OnInit, Input} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {INavBarData} from "./inavbadata";

@Component({
	selector: 'app-sublevel-menu',
	template: `
		<ul *ngIf="collapsed && data.items && data.items.length > 0"
			[@submenu]="expanded ? {value:'visible',
                 params:{transitionParams:'400ms cubic-bezier(0.86, 0, 0.07, 1)',height:'*'}}
                 :{value:'hidden',
                 params:{transitionParams:'400ms cubic-bezier(0.86, 0, 0.07, 1)',height:'0'}}"
			class="sublevel-nav">
			<li *ngFor="let item of data.items" class="sublevel-nav-item">
				<a class="sublevel-nav-link"
				   (click)="handleClick(item)"
				   *ngIf="item.items && item.items.length > 0">
					<i class="sublevel-link-icon fa fa-circle"></i>
					<span class="sublevel-link-text" *ngIf="collapsed"> {{ item.label }}</span>
					<i class="menu-collapse-icon" *ngIf="item.items && collapsed"
					   [ngClass]="!item.expanded ? 'fa fa-angle-right':'fa fa-angle-down'">
					</i>
				</a>
				<a class="sublevel-nav-link" *ngIf="!item.items || (item.items && item.items.length===0)"
				   [routerLink]="[item.routerlink]"
				   routerLinkActive="active"
				   [routerLinkActiveOptions]="{exact:true}">
<!--					<i class="sublevel-link-icon" [class]="item.icon"></i>--> <!-- TODO remettre a ajuster les icone des sous menu -->
					<span class="sublevel-link-text ml-2" *ngIf="collapsed"> {{ item.label }}</span>
 				</a>
				<div *ngIf="item.items && item.items.length >0">
					<app-sublevel-menu [collapsed]="collapsed" [multiple]="multiple"
									   [expanded]="item.expanded"
									   [data]="item">
					</app-sublevel-menu>
				</div>
			</li>
		</ul>
	`,
	styleUrls: ["./sidebar.component.scss"],
	animations: [
		trigger('submenu', [
			state('hidden', style({
				height: '0',
				overflow: 'hidden'
			})),
			state('visible', style({
				height: '*'
			})),
			transition('visible <=> hidden', [
				style({
					overflow: 'hidden'
				}),
				animate('{{transitionParams}}')]),
			transition('void => *', animate(0))
		])
	]
})
export class SublevelMenuComponent implements OnInit {

	@Input() data: INavBarData = {
		routerlink: '',
		icon: '',
		label: '',
		items: []
	}
	@Input() collapsed = false;
	@Input() animating: boolean | undefined;
	@Input() expanded: boolean | undefined;
	@Input() multiple: boolean = false;

	constructor() {
	}

	ngOnInit(): void {
	}

	handleClick(item: any): void {
		if (!this.multiple) {
			if (this.data.items && this.data.items.length > 0) {
				for (let modelItem of this.data.items) {
					modelItem.expanded = false
				}
			}
		}
		item.expanded = !item.expanded;
	}

}
