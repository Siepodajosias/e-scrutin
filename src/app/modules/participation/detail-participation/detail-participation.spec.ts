import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailParticipationComponent } from 'src/app/modules/participation/composants/detail-participation/detail-participation.component';

describe('DetailParticipationComponent', () => {
  let component: DetailParticipationComponent;
  let fixture: ComponentFixture<DetailParticipationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailParticipationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailParticipationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
