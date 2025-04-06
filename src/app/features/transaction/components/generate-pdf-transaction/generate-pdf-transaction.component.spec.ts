import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratePdfTransactionComponent } from './generate-pdf-transaction.component';

describe('GeneratePdfTransactionComponent', () => {
  let component: GeneratePdfTransactionComponent;
  let fixture: ComponentFixture<GeneratePdfTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneratePdfTransactionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneratePdfTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
