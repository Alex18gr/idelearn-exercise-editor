import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExerciseFileLocalService {

  constructor(private electron: ElectronService) { }

  openExerciseFileWithDialog() {
    return from(this.electron.ipcRenderer.invoke('openExerciseFile'));
  }

}
