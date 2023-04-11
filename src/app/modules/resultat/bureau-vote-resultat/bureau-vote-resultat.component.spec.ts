import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BureauVoteResultatComponent } from 'src/app/modules/resultat/bureau-vote-resultat/bureau-vote-resultat.component';

describe('BureauVoteResultatComponent', () => {
  let component: BureauVoteResultatComponent;
  let fixture: ComponentFixture<BureauVoteResultatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BureauVoteResultatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BureauVoteResultatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
