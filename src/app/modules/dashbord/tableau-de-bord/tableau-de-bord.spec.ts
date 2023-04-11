import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableauDeBord } from './tableau-de-bord';

describe('TableauDeBordComponent', () => {
  let component: TableauDeBord;
  let fixture: ComponentFixture<TableauDeBord>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableauDeBord ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableauDeBord);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
