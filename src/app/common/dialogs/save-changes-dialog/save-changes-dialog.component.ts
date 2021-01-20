import { ChangeDetectorRef } from '@angular/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ExerciseDialogService } from 'src/app/exercise/dialogs/exercise-dialog.service';
import { ExerciseService } from 'src/app/exercise/exercise.service';
import { ExerciseFileService } from 'src/app/exercise/file/exercise-file.service';

@Component({
  selector: 'app-save-changes-dialog',
  templateUrl: './save-changes-dialog.component.html',
  styleUrls: ['./save-changes-dialog.component.scss']
})
export class SaveChangesDialogComponent implements OnInit, OnDestroy {
  display: boolean = false;
  title: string = '';
  savingData: boolean = false;
  showDialogSubscription: Subscription | undefined;
  promptType?: 'new' | 'open' | 'close';

  constructor(
    private exerciseDialogService: ExerciseDialogService,
    private exerciseService: ExerciseService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.initializeSubscriptions();
  }

  initializeSubscriptions() {
    this.showDialogSubscription = this.exerciseDialogService.showExerciseSaveChangesDialogObservable.subscribe((options: { promptType: 'new' | 'open' | 'close' }) => {
      this.showDialog(options.promptType);
    });
  }

  showDialog(promptType: 'new' | 'open' | 'close') {
    this.promptType = promptType;
    this.display = true;
    switch (promptType) {
      case 'new':
        this.title = 'Create New Exercise';
        break;
      case 'open':
        this.title = 'Open Exercise';
        break;
      case 'close':
        this.title = 'Close Editor';
        break;
      default:
        this.title = '';
        break;
    }
    this.cdr.detectChanges(); // this is neccessary because of the electron calls, the cdr is not called automatically
  }

  hideDialog() {
    this.title = '';
    this.display = false;
  }

  saveExercise() {
    this.exerciseService.exportExercise().subscribe((res) => {
      if (res === 'OK') {
        this.messageService.add({ severity: 'success', summary: 'Edit Success', detail: 'Exercise exported successfuly' });
      } else if (res === 'CANCELED') {
        this.messageService.add({ severity: 'warn', summary: 'Export Canceled' });
      }
      this.display = false;
    });
  }

  discardChanges() {
    switch (this.promptType) {
      case 'new':
        this.exerciseDialogService.showNewExerciseDialog();
        break;
      case 'open':
        this.exerciseService.openExercise();
        break;
      case 'close':
        // send close message to the backend to close the application
        break;
      default:
        break;
    }
    this.display = false;
  }

  ngOnDestroy() {
    if (this.showDialogSubscription) { this.showDialogSubscription.unsubscribe(); }
  }

}
