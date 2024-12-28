import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCategoryDeleteComponent } from './modal-category-delete.component';

describe('ModalCategoryDeleteComponent', () => {
  let component: ModalCategoryDeleteComponent;
  let fixture: ComponentFixture<ModalCategoryDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCategoryDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCategoryDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
