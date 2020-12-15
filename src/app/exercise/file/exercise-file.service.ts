import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExerciseFileService {

  constructor() { }

  openExerciseFileWithDialog() {
    return of(null);
  }

  createNewExerciseFile(options: { exerciseDetailsData: any }) {
    return of(null);
  }
}
