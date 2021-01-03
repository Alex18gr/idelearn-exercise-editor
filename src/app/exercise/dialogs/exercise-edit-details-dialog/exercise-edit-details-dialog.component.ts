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
  showDialogEditSubscription!: Subscription;
  showDialogNewSubscription!: Subscription;
  savingData: boolean = false;
  editMode: boolean = false;
  title: string = 'Edit Exercise Details';
  uploadProjectZipLabel: string = '';
  exercise!: Exercise;
  exerciseForm!: FormGroup | null;
  enableFileUpload: boolean = false;

  constructor(private exerciseDialogService: ExerciseDialogService,
    private exerciseService: ExerciseService,
    private messageService: MessageService,
    private exerciseFileService: ExerciseFileService) { }

  ngOnInit(): void {
    this.initializeSubscriptions();
  }

  initializeSubscriptions() {
    this.showDialogEditSubscription = this.exerciseDialogService.showEditExerciseDetailsObservable.subscribe((exercise: Exercise) => {
      this.editMode = true;
      this.exercise = exercise;
      this.initializeForm();
      this.enableFileUpload = exercise.projectInfo.startingProject;
      if (exercise.projectInfo.startingProject) {
        this.uploadProjectZipLabel = 'Upload New Project Zip';
      } else {
        this.uploadProjectZipLabel = 'Upload Project Zip';
      }
      this.exerciseForm?.patchValue({
        exerciseName: exercise.name,
        projectTitle: exercise.projectInfo.title,
        hasStartingProject: exercise.projectInfo.startingProject
      });
      this.showDialog();
    });
    this.showDialogNewSubscription = this.exerciseDialogService.showNewExerciseObservable.subscribe(() => {
      this.editMode = false;
      this.initializeForm();
      this.showDialog();
    });
  }

  initializeForm() {
    this.exerciseForm = new FormGroup({
      exerciseName: new FormControl('', [Validators.required]),
      projectTitle: new FormControl('', [Validators.required]),
      hasStartingProject: new FormControl(''),
      startingProjectUrl: new FormControl('')
    });
  }

  showDialog() {
    this.display = true;
  }

  hideDialog() {
    this.exerciseForm = null;
    this.display = false;
    this.uploadProjectZipLabel = '';
  }

  isControlInvalid(control: AbstractControl): boolean {
    return control.invalid && control.dirty;
  }

  getErrorMessage(control: AbstractControl): string {
    if (control.errors?.required) { return 'This field is required' }
    return ''
  }

  saveExercise() {
    if (this.exerciseForm?.valid) {
      if (this.editMode) {
        this.exerciseService.saveExerciseDetails({ exercise: this.exercise, exerciseDetailsData: this.exerciseForm.getRawValue() }).subscribe(res => {
          this.savingData = false;
          this.messageService.add({ severity: 'success', summary: 'Edit Success', detail: 'Exercise details changed successfuly' });
          this.hideDialog();
        }, error => {
          this.savingData = false;
          this.messageService.add({ severity: 'error', summary: 'Edit error', detail: error });
        });
      } else {
        this.exerciseService.createExercise({ exerciseDetailsData: this.exerciseForm.getRawValue() }).subscribe(res => {
          this.savingData = false;
          this.messageService.add({ severity: 'success', summary: 'Create Success', detail: 'Exercise created successfuly' });
          this.hideDialog();
        }, error => {
          this.savingData = false;
          this.messageService.add({ severity: 'error', summary: 'Create error', detail: error });
        });
      }
      
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

  logFormValue() {
    console.log(this.exerciseForm?.getRawValue());
  }

  startProjectSwitchChanged(event: any) {
    this.enableFileUpload = event.checked;
    if (!event.checked && !this.editMode) {
      this.exerciseForm?.patchValue({
        startingProjectUrl: ''
      });
    }
  }

}
