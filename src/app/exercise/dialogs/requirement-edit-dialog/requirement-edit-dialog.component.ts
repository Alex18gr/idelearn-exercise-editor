import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ClassRequirement } from 'src/app/models/requirements/class-requirement';
import { IRequirement } from 'src/app/models/requirements/irequirement';
import { ExerciseService } from '../../exercise.service';
import { ExerciseDialogService } from '../exercise-dialog.service';

@Component({
  selector: 'app-requirement-edit-dialog',
  templateUrl: './requirement-edit-dialog.component.html',
  styleUrls: ['./requirement-edit-dialog.component.scss']
})
export class RequirementEditDialogComponent implements OnInit, OnDestroy {
  display: boolean = false;
  showDialogSubscription!: Subscription;
  savingData: boolean = false;
  editMode: boolean = false;
  editRequirement!: IRequirement | null;
  title: string = '';
  selectedRequirementType!: string;
  requirementTypeOptions: RequirementTypeDropdown[] = [
    { label: 'Class Requirement', value: 'class' }
  ];
  requirementTypeDropdownDisabled: boolean = false;

  classRequirementForm!: FormGroup;

  constructor(private exerciseDialogService: ExerciseDialogService,
    private exerciseService: ExerciseService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.initializeSubscriptions();
    this.initializeClassRequirementForm();
  }

  initializeClassRequirementForm() {
    this.classRequirementForm = new FormGroup({
      className: new FormControl('', [Validators.required])
    });
  }

  initializeSubscriptions() {
    this.showDialogSubscription = this.exerciseDialogService.showEditRequirementDialogObservable.subscribe(options => {
      if (options?.requirement) {
        this.editMode = true;
        this.editRequirement = options.requirement;
        this.selectedRequirementType = this.requirementTypeOptions[0].value;
        this.requirementTypeDropdownDisabled = true;
        this.title = 'Edit Requirement';
      } else {
        this.editMode = false;
        this.selectedRequirementType = this.requirementTypeOptions[0].value;
        this.requirementTypeDropdownDisabled = false;
        this.title = 'Add New Requirement';
      }
      this.showDialog();
    });
  }

  showDialog() {
    this.display = true;
    if (this.editMode) {
      this.classRequirementForm.patchValue({
        className: (this.editRequirement as ClassRequirement).name
      });
    }
  }

  hideDialog() {
    this.display = false;
    this.title = '';
    this.classRequirementForm.reset();
    this.editRequirement = null;
    this.selectedRequirementType = this.requirementTypeOptions[0].value;
  }

  ngOnDestroy(): void {
    if (this.showDialogSubscription) {
      this.showDialogSubscription.unsubscribe();
    }
  }

  isControlInvalid(control: AbstractControl): boolean {
    return control.invalid && control.dirty;
  }

  getErrorMessage(control: AbstractControl): string {
    if (control.errors?.required) { return 'This field is required' }
    return ''
  }

  saveClassRequirement() {
    if (this.editMode && !!this.editRequirement) {
      this.savingData = true;
      this.exerciseService.editRequirement({
        requirement: this.editRequirement,
        newValue: this.classRequirementForm.getRawValue()
      }).subscribe(data => {
        this.savingData = false;
        this.messageService.add({ severity: 'success', summary: 'Edit Success', detail: 'Class Requirement Edited successfuly' });
        this.hideDialog();
      }, error => {
        this.savingData = false;
        this.messageService.add({ severity: 'error', summary: 'Create error', detail: error });
      });
    } else {
      this.savingData = true;
      this.exerciseService.addRequirementToCurrentExercise({
        type: this.selectedRequirementType,
        requirementData: this.classRequirementForm.getRawValue()
      }).subscribe(data => {
        this.savingData = false;
        this.messageService.add({ severity: 'success', summary: 'Created Success', detail: 'Class Requirement created successfuly' });
        this.hideDialog();
      }, error => {
        this.savingData = false;
        this.messageService.add({ severity: 'error', summary: 'Create error', detail: error });
      });
    }
  }

}

interface RequirementTypeDropdown {
  label: string,
  value: string
}
