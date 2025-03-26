import { TestBed } from '@angular/core/testing';

import { FilterTransactionService } from './filter-transaction.service';

describe('FilterTransactionService', () => {
  let service: FilterTransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterTransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
