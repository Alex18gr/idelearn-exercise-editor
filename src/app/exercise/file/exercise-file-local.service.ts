import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { MessageService } from 'primeng/api';
import { from } from 'rxjs';
import { Exercise } from 'src/app/models/exercise';
import { ExerciseDialogService } from '../dialogs/exercise-dialog.service';
import { ExerciseService } from '../exercise.service';

@Injectable({
  providedIn: 'root'
})
export class ExerciseFileLocalService {

  constructor(
    private electron: ElectronService,
    private messageService: MessageService,
    private exerciseDialogService: ExerciseDialogService
  ) { }

  addListenerToNewExercisePrompt(listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void) {
    this.electron.ipcRenderer.on('newExercisePrompt', listener);
  }

  addListenerToOpenExercisePrompt(listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void) {
    this.electron.ipcRenderer.on('openExercisePrompt', listener);
  }

  openExerciseFileWithDialog() {
    return from(this.electron.ipcRenderer.invoke('openExerciseFile'));
  }

  createNewExerciseFile(options: { exerciseDetailsData: any }) {
    return from(this.electron.ipcRenderer.invoke('createNewExercise', options.exerciseDetailsData));
  }

  exportExercisePackage(exercise: any) {
    return from(this.electron.ipcRenderer.invoke('exportCurrentExercise', exercise));
  }

  updateExerciseZipProject(exerciseFile: { fileUrl: string }) {
    return from(this.electron.ipcRenderer.invoke('updateExerciseZipProject', exerciseFile));
  }
}
