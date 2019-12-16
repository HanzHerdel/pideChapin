import { TestBed, async, inject } from '@angular/core/testing';

import { ModeradorGuard } from './moderador.guard';

describe('ModeradorGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModeradorGuard]
    });
  });

  it('should ...', inject([ModeradorGuard], (guard: ModeradorGuard) => {
    expect(guard).toBeTruthy();
  }));
});
