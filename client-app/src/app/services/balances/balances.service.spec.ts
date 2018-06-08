import { TestBed, inject } from '@angular/core/testing';

import { BalancesService } from './balances.service';

describe('BalancesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BalancesService]
    });
  });

  it('should be created', inject([BalancesService], (service: BalancesService) => {
    expect(service).toBeTruthy();
  }));
});
