import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { from } from 'rxjs';
import { Exercise } from 'src/app/models/exercise';

@Injectable({
  providedIn: 'root'
})
export class ExerciseFileLocalService {

  constructor(private electron: ElectronService) { }

  openExerciseFileWithDialog() {
    return from(this.electron.ipcRenderer.invoke('openExerciseFile'));
  }

  createNewExerciseFile(options: { exerciseDetailsData: any }) {
    return from(this.electron.ipcRenderer.invoke('createNewExercise', options.exerciseDetailsData));
  }

  exportExercisePackage(exercise: Exercise) {
    return from(this.electron.ipcRenderer.invoke('exportCurrentExercise', exercise));
  }
}
