import { ChangeDetectorRef } from '@angular/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
  title: string = 'Exercise Service';
  savingData: boolean = false;
  showDialogSubscription: Subscription | undefined;

  constructor(
    private exerciseDialogService: ExerciseDialogService,
    private exerciseService: ExerciseService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initializeSubscriptions();
  }

  initializeSubscriptions() {
    this.showDialogSubscription = this.exerciseDialogService.showExerciseSaveChangesDialogObservable.subscribe(() => {
      this.showDialog();
    });
  }

  showDialog() {
    this.display = true;
    this.cdr.detectChanges(); // this is neccessary because of the electron calls, the cdr is not called automatically
  }

  hideDialog() {
    this.display = false;
  }

  saveExercise() {
    this.exerciseService.exportExercise();
  }

  discardChanges() {
    this.exerciseDialogService.showNewExerciseDialog();
  }

  ngOnDestroy() {
    if (this.showDialogSubscription) { this.showDialogSubscription.unsubscribe(); }
  }

}
