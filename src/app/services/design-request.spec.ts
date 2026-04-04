import { TestBed } from '@angular/core/testing';

import { DesignRequest } from './design-request';

describe('DesignRequest', () => {
  let service: DesignRequest;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesignRequest);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
