import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableTransactionComponent } from './table-transaction.component';

describe('TableTransactionComponent', () => {
  let component: TableTransactionComponent;
  let fixture: ComponentFixture<TableTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableTransactionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
