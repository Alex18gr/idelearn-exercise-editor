import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Exercise } from 'src/app/models/exercise';
import { ClassRequirement } from 'src/app/models/requirements/class-requirement';
import { ContainsSubRequirement } from 'src/app/models/requirements/contains-sub-requirement';
import { ExtendSubRequirement } from 'src/app/models/requirements/extend-sub-requirement';
import { ClassHasFieldRequirement } from 'src/app/models/requirements/has-field-sub-requirement';
import { IRequirement } from 'src/app/models/requirements/irequirement';
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
    private exerciseDialogService: ExerciseDialogService) { }

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

  goBackToRequirements() {
    this.back.emit();
  }

  stringifyType(type: RequirementType): string {
    return this.exerciseService.stringifyType(type);
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

}
