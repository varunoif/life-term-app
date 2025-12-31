import { TestBed } from '@angular/core/testing';

import { ConfigServicesService } from './config-services.service';

describe('ConfigServicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConfigServicesService = TestBed.get(ConfigServicesService);
    expect(service).toBeTruthy();
  });
});
