import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionDebtsComponent } from './section-debts.component';

describe('SectionDebtsComponent', () => {
  let component: SectionDebtsComponent;
  let fixture: ComponentFixture<SectionDebtsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionDebtsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionDebtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
