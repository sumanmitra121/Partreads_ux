import { TestBed } from '@angular/core/testing';

import { UtilityTService } from './utility-t.service';

describe('UtilityTService', () => {
  let service: UtilityTService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilityTService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
