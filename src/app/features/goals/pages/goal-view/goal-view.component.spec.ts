import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalViewComponent } from './goal-view.component';

describe('GoalViewComponent', () => {
  let component: GoalViewComponent;
  let fixture: ComponentFixture<GoalViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
