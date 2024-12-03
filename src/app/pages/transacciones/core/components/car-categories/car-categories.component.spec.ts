import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarCategoriesComponent } from './car-categories.component';

describe('CarCategoriesComponent', () => {
  let component: CarCategoriesComponent;
  let fixture: ComponentFixture<CarCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
