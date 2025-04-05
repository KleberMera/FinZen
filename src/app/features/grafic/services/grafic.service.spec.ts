import { TestBed } from '@angular/core/testing';

import { GraficService } from './grafic.service';

describe('GraficService', () => {
  let service: GraficService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraficService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
