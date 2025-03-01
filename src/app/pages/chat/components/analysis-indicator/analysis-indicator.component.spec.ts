import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisIndicatorComponent } from './analysis-indicator.component';

describe('AnalysisIndicatorComponent', () => {
  let component: AnalysisIndicatorComponent;
  let fixture: ComponentFixture<AnalysisIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisIndicatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
