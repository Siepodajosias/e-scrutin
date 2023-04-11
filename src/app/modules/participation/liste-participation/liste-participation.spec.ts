import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeParticipation } from './liste-participation';

describe('ListeParticipationComponent', () => {
  let component: ListeParticipation;
  let fixture: ComponentFixture<ListeParticipation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeParticipation ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeParticipation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
