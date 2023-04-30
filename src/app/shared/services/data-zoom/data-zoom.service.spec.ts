import { TestBed } from '@angular/core/testing';

import { DataZoomService } from './data-zoom.service';

describe('DataZoomService', () => {
  let service: DataZoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataZoomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
