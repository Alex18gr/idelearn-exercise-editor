import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Exercise } from 'src/app/models/exercise';
import { ClassOverridesObjectMethodSubRequirement } from 'src/app/models/requirements/class-overrides-object-method-sub-requirement';
import { ClassRequirement } from 'src/app/models/requirements/class-requirement';
import { ContainsSubRequirement } from 'src/app/models/requirements/contains-sub-requirement';
import { ExtendNameRequirement } from 'src/app/models/requirements/extend-name-requirement';
import { ExtendSubRequirement } from 'src/app/models/requirements/extend-sub-requirement';
import { ClassHasConstructorRequirement } from 'src/app/models/requirements/has-constructor-sub-requirement';
import { ClassHasFieldRequirement } from 'src/app/models/requirements/has-field-sub-requirement';
import { ClassHasMethodRequirement } from 'src/app/models/requirements/has-method-sub-requirement';
import { ImplementNameRequirement } from 'src/app/models/requirements/implement-name-requirement';
import { IRequirement } from 'src/app/models/requirements/irequirement';
import { ISubRequirement } from 'src/app/models/requirements/isub-requirement';
import { MethodCallInMethodRequirement } from 'src/app/models/requirements/method-call-in-method-sub-requirement';
import { RequirementConstructor } from 'src/app/models/requirements/requirement-constructor';
import { RequirementMethod } from 'src/app/models/requirements/requirement-method';
import { RequirementType } from 'src/app/models/requirements/requirement-type';
import { ExerciseDialogService } from '../dialogs/exercise-dialog.service';
import { ExerciseService } from '../exercise.service';

@Component({
  selector: 'app-exercise-sub-requirements-view',
  templateUrl: './exercise-sub-requirements-view.component.html',
  styleUrls: ['./exercise-sub-requirements-view.component.scss']
})
export class ExerciseSubRequirementsViewComponent implements OnInit {
  @Input() exercise!: Exercise;
  @Input() editClassRequirement!: ClassRequirement;
  @Output() back: EventEmitter<void> = new EventEmitter();

  constructor(private exerciseService: ExerciseService,
    private exerciseDialogService: ExerciseDialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) { }

  ngOnInit(): void {
  }

  editSubRequirement(req: IRequirement) {
    // open the modal sub requirement
    this.exerciseDialogService.showEditSubrequirementDialog({
      parentRequirement: this.editClassRequirement,
      subrequirement: req
    });
  }

  addSubRequirement() {
    // opne the modal for a new requirement
    this.exerciseDialogService.showEditSubrequirementDialog({
      parentRequirement: this.editClassRequirement
    });
  }

  deleteSubRequirement(req: ISubRequirement) {
    this.confirmationService.confirm({
      header: 'Delete Subrequirement',
      message: 'Are you sure that you want to delete this subrequirement?',
      accept: () => {
        this.exerciseService.deleteSubRequirement(req).subscribe(res => {
          this.messageService.add({ severity: 'success', summary: 'Delete Success', detail: 'Subrequirement deleted successfuly' });
        }, error => {
          this.messageService.add({ severity: 'error', summary: 'Delete error', detail: error });
        });
      }
    });
  }

  goBackToRequirements() {
    this.back.emit();
  }

  stringifyType(type: RequirementType): string {
    return this.exerciseService.stringifyType(type);
  }

  getMethodTypeString(method: RequirementMethod | RequirementConstructor): string {
    return this.exerciseService.getMethodParametersString(method);
  }

  getExtendRequirement(req: IRequirement): ExtendSubRequirement {
    return req as ExtendSubRequirement;
  }

  getContainsRequirement(req: IRequirement): ContainsSubRequirement {
    return req as ContainsSubRequirement;
  }

  getClassHasFieldRequirement(req: IRequirement): ClassHasFieldRequirement {
    return req as ClassHasFieldRequirement;
  }

  getClassHasMethodRequirement(req: IRequirement): ClassHasMethodRequirement {
    return req as ClassHasMethodRequirement;
  }

  getClassHasConstructorRequirement(req: IRequirement): ClassHasConstructorRequirement {
    return req as ClassHasConstructorRequirement;
  }

  getImplementNameRequirement(req: IRequirement): ImplementNameRequirement {
    return req as ImplementNameRequirement;
  }

  getExtendNameRequirement(req: IRequirement): ExtendNameRequirement {
    return req as ExtendNameRequirement;
  }

  getOverrideObjectMethodRequirement(req: IRequirement): ClassOverridesObjectMethodSubRequirement {
    return req as ClassOverridesObjectMethodSubRequirement;
  }

  getMethodCallInMethodRequirement(req: IRequirement): MethodCallInMethodRequirement {
    return req as MethodCallInMethodRequirement;
  }

}
