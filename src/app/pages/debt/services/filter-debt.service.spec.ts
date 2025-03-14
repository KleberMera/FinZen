import { TestBed } from '@angular/core/testing';

import { FilterDebtService } from './filter-debt.service';

describe('FilterDebtService', () => {
  let service: FilterDebtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterDebtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
