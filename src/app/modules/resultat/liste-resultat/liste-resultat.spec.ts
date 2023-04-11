import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeResultat } from './liste-resultat';

describe('ListeResultatComponent', () => {
  let component: ListeResultat;
  let fixture: ComponentFixture<ListeResultat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeResultat ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeResultat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
