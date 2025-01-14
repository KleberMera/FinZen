import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderCategoryComponent } from './header-category.component';

describe('HeaderCategoryComponent', () => {
  let component: HeaderCategoryComponent;
  let fixture: ComponentFixture<HeaderCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
