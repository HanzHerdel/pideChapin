import { TestBed } from '@angular/core/testing';

import { ModeradorService } from './moderador.service';

describe('ModeradorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ModeradorService = TestBed.get(ModeradorService);
    expect(service).toBeTruthy();
  });
});
