import { TestBed } from '@angular/core/testing';

import { ExerciseFileService } from './exercise-file.service';

describe('ExerciseFileService', () => {
  let service: ExerciseFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExerciseFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
