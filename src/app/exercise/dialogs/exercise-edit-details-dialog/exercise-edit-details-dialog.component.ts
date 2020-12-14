import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Exercise } from 'src/app/models/exercise';
import { ExerciseService } from '../../exercise.service';
import { ExerciseFileService } from '../../file/exercise-file.service';
import { ExerciseDialogService } from '../exercise-dialog.service';

@Component({
  selector: 'app-exercise-edit-details-dialog',
  templateUrl: './exercise-edit-details-dialog.component.html',
  styleUrls: ['./exercise-edit-details-dialog.component.scss']
})
export class ExerciseEditDetailsDialogComponent implements OnInit {
  display: boolean = false;
  showDialogSubscription!: Subscription;
  savingData: boolean = false;
  title: string = 'Edit Exercise Details';
  exercise!: Exercise;
  exerciseForm!: FormGroup;

  constructor(private exerciseDialogService: ExerciseDialogService,
    private exerciseService: ExerciseService,
    private messageService: MessageService,
    private exerciseFileService: ExerciseFileService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.initializeSubscriptions();
  }

  initializeSubscriptions() {
    this.showDialogSubscription = this.exerciseDialogService.showEditExerciseDetailsObservable.subscribe((exercise: Exercise) => {
      this.exercise = exercise;
      this.exerciseForm.patchValue({
        exerciseName: exercise.name,
        projectTitle: exercise.projectInfo.title
      });
      this.showDialog();
    });
  }

  initializeForm() {
    this.exerciseForm = new FormGroup({
      exerciseName: new FormControl('', [Validators.required]),
      projectTitle: new FormControl('', [Validators.required]),
      startingProject: new FormControl('')
    });
  }

  showDialog() {
    this.display = true;
  }

  hideDialog() {
    this.display = false;
  }

  isControlInvalid(control: AbstractControl): boolean {
    return control.invalid && control.dirty;
  }

  getErrorMessage(control: AbstractControl): string {
    if (control.errors?.required) { return 'This field is required' }
    return ''
  }

  saveExercise() {
    if (this.exerciseForm.valid) {
      this.exerciseService.saveExerciseDetails({ exercise: this.exercise, exerciseDetailsData: this.exerciseForm.getRawValue() }).subscribe(res => {
        this.savingData = false;
        this.messageService.add({ severity: 'success', summary: 'Edit Success', detail: 'Exercise details changed successfuly' });
        this.hideDialog();
      }, error => {
        this.savingData = false;
        this.messageService.add({ severity: 'error', summary: 'Create error', detail: error });
      });
    }
  }

  myUploader(event: any) {
    //event.files == files to upload
    const files: File[] = event.files;
    console.log(files);
  }

  openSelectFileDialog() {
    this.exerciseFileService.openExerciseFileWithDialog().subscribe(res => {
      console.log(res);
    });
  }

}
