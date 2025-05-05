import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionRecurringComponent } from './section-recurring.component';

describe('SectionRecurringComponent', () => {
  let component: SectionRecurringComponent;
  let fixture: ComponentFixture<SectionRecurringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionRecurringComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionRecurringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
