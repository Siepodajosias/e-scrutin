import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailResultatComponent } from 'src/app/modules/resultat/composants/detail-resultat/detail-resultat.component';

describe('DetailResultatComponent', () => {
	let component: DetailResultatComponent;
	let fixture: ComponentFixture<DetailResultatComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [DetailResultatComponent]
		})
				.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DetailResultatComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
