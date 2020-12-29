import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { IRequirement } from 'src/app/models/requirements/irequirement';
import { SubRequirementType } from 'src/app/models/sub-requirement-type';
import { ExerciseService } from '../../exercise.service';
import { ExerciseDialogService } from '../exercise-dialog.service';
import { SubRequirementFormComponent } from './sub-requirement-form/sub-requirement-form.component';

@Component({
  selector: 'app-sub-requirement-edit-dialog',
  templateUrl: './sub-requirement-edit-dialog.component.html',
  styleUrls: ['./sub-requirement-edit-dialog.component.scss']
})
export class SubRequirementEditDialogComponent implements OnInit {
  @ViewChild('subRequirementForm') subRequirementForm!: SubRequirementFormComponent;
  display: boolean = false;
  showDialogSubscription!: Subscription;
  savingData: boolean = false;

  editMode: boolean = false;
  editSubRequirement!: IRequirement | null;
  parentRequirement!: IRequirement | null;

  title: string = '';
  selectedSubRequirementType!: SubRequirementType;
  subRequirementTypeOptions: RequirementTypeDropdown[] = [
    { label: 'Extend a Class', value: 'extend' },
    { label: 'Contain an Instance of a class', value: 'contains' },
    { label: 'Contain a field', value: 'contains-field' },
    { label: 'Contain a method', value: 'method' }
  ];
  subRequirementTypeDropdownDisabled: boolean = false;

  constructor(private exerciseDialogService: ExerciseDialogService,
    private exerciseService: ExerciseService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.initializeSubscriptions();
  }

  initializeSubscriptions() {
    this.showDialogSubscription = this.exerciseDialogService.showEditSubRequirementDialogObservable.subscribe(options => {
      if (options?.subrequirement) {
        this.editMode = true;
        this.parentRequirement = options.parentRequirement;
        this.editSubRequirement = options.subrequirement;
        this.selectedSubRequirementType = options.subrequirement.type as SubRequirementType;
        this.subRequirementTypeDropdownDisabled = true;
        this.title = 'Edit Subrequirement Requirement';
      } else {
        this.editMode = false;
        this.parentRequirement = options.parentRequirement;
        this.selectedSubRequirementType = this.subRequirementTypeOptions[0].value as SubRequirementType;
        this.subRequirementTypeDropdownDisabled = false;
        this.title = 'Add New Subrequirement';
      }
      this.showDialog();
    });
  }

  showDialog() {
    this.display = true;
  }

  hideDialog() {
    this.display = false;
    this.title = '';
    this.editSubRequirement = null;
    this.parentRequirement = null;
    this.selectedSubRequirementType = this.subRequirementTypeOptions[0].value as SubRequirementType;
  }

  saveSubRequirement() {
    const formValue: any = this.subRequirementForm.getFormValue();
    if (formValue && !!this.parentRequirement) {
      if (this.editMode && !!this.editSubRequirement) {
        this.savingData = true;
        this.exerciseService.editSubRequirement({
          parentRequirement: this.parentRequirement,
          subRequirement: this.editSubRequirement,
          newValue: formValue
      }).subscribe(data => {
            this.savingData = false;
            this.messageService.add({ severity: 'success', summary: 'Edit Success', detail: 'Subrequirement Edited successfuly' });
            this.hideDialog();
          }, error => {
            this.savingData = false;
            this.messageService.add({ severity: 'error', summary: 'Create error', detail: error });
          });
      } else {
        this.savingData = true;
        this.exerciseService.addSubRequirementToRequirement({
          parentRequirement: this.parentRequirement,
          type: this.selectedSubRequirementType,
          subRequirementData: formValue
        }).subscribe(data => {
          this.savingData = false;
          this.messageService.add({ severity: 'success', summary: 'Created Success', detail: 'Subrequirement created successfuly' });
          this.hideDialog();
        }, error => {
          this.savingData = false;
          this.messageService.add({ severity: 'error', summary: 'Create error', detail: error });
        });
      }
    }
  }

  isSubRequirementFormValid(): boolean {
    if (this.subRequirementForm) {
      return this.subRequirementForm.isFormValid();
    } else {
      return false;
    }
  }

  ngOnDestroy(): void {
    if (this.showDialogSubscription) {
      this.showDialogSubscription.unsubscribe();
    }
  }

}

interface RequirementTypeDropdown {
  label: string,
  value: string
}
