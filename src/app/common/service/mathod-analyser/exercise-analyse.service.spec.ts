import { TestBed } from '@angular/core/testing';

import { ExerciseAnalyseService } from './exercise-analyse.service';

describe('ExerciseAnalyseService', () => {
  let service: ExerciseAnalyseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExerciseAnalyseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
