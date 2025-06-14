import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartRecordComponent } from './chart-record.component';

describe('ChartRecordComponent', () => {
  let component: ChartRecordComponent;
  let fixture: ComponentFixture<ChartRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartRecordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
