import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtSearchComponent } from './debt-search.component';

describe('DebtSearchComponent', () => {
  let component: DebtSearchComponent;
  let fixture: ComponentFixture<DebtSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebtSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebtSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
