import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonFiltersComponent } from './skeleton-filters.component';

describe('SkeletonFiltersComponent', () => {
  let component: SkeletonFiltersComponent;
  let fixture: ComponentFixture<SkeletonFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonFiltersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkeletonFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
