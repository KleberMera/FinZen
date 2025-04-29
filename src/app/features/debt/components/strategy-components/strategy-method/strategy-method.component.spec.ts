import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyMethodComponent } from './strategy-method.component';

describe('StrategyMethodComponent', () => {
  let component: StrategyMethodComponent;
  let fixture: ComponentFixture<StrategyMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StrategyMethodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StrategyMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
