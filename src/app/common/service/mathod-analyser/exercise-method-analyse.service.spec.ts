import { TestBed } from '@angular/core/testing';

import { ExerciseMethodAnalyseService } from './exercise-method-analyse.service';

describe('ExerciseMethodAnalyseService', () => {
  let service: ExerciseMethodAnalyseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExerciseMethodAnalyseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
