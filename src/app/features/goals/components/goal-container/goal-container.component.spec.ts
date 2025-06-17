import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalContainerComponent } from './goal-container.component';

describe('GoalContainerComponent', () => {
  let component: GoalContainerComponent;
  let fixture: ComponentFixture<GoalContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoalContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
