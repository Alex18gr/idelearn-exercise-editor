import { TestBed } from '@angular/core/testing';

import { ExerciseFileLocalService } from './exercise-file-local.service';

describe('ExerciseFileLocalService', () => {
  let service: ExerciseFileLocalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExerciseFileLocalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
