import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFilterTransactionComponent } from './search-filter-transaction.component';

describe('SearchFilterTransactionComponent', () => {
  let component: SearchFilterTransactionComponent;
  let fixture: ComponentFixture<SearchFilterTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchFilterTransactionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchFilterTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
