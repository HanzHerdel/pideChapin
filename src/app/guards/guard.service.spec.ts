import { TestBed } from '@angular/core/testing';

import { LogedGuard } from './guard.service';

describe('GuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LogedGuard = TestBed.get(LogedGuard);
    expect(service).toBeTruthy();
  });
});
