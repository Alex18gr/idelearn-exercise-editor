import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Exercise } from 'src/app/models/exercise';

@Injectable({
  providedIn: 'root'
})
export class ExerciseFileService {

  constructor() { }

  addListenerToNewExercisePrompt(listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void) {
  }

  openExerciseFileWithDialog() {
    return of(null);
  }

  createNewExerciseFile(options: { exerciseDetailsData: any }) {
    return of(null);
  }

  exportExercisePackage(exercise: any) {
    return of(null);
  }

  updateExerciseZipProject(exerciseFile: { fileUrl: string }) {
    return of(null);
  }
}
