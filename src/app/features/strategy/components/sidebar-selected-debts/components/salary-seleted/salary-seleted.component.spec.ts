import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalarySeletedComponent } from './salary-seleted.component';

describe('SalarySeletedComponent', () => {
  let component: SalarySeletedComponent;
  let fixture: ComponentFixture<SalarySeletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalarySeletedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalarySeletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
