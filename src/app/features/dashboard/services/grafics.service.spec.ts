import { TestBed } from '@angular/core/testing';

import { GraficsService } from './grafics.service';

describe('GraficsService', () => {
  let service: GraficsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraficsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
