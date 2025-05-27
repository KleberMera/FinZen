import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormContributionComponent } from './form-contribution.component';

describe('FormContributionComponent', () => {
  let component: FormContributionComponent;
  let fixture: ComponentFixture<FormContributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormContributionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormContributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
