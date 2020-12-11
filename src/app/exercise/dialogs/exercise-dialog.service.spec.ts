import { TestBed } from '@angular/core/testing';

import { ExerciseDialogService } from './exercise-dialog.service';

describe('ExerciseDialogService', () => {
  let service: ExerciseDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExerciseDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
