import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { idCheckGuard } from './id-check.guard';

describe('idCheckGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => idCheckGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
