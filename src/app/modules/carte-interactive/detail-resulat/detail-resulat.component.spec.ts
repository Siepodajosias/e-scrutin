import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailResulatComponent } from './detail-resulat.component';

describe('DetailResulatComponent', () => {
  let component: DetailResulatComponent;
  let fixture: ComponentFixture<DetailResulatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailResulatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailResulatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
