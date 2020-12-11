import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Exercise } from 'src/app/models/exercise';
import { ClassRequirement } from 'src/app/models/requirements/class-requirement';
import { IRequirement } from 'src/app/models/requirements/irequirement';

@Component({
  selector: 'app-exercise-sub-requirements-view',
  templateUrl: './exercise-sub-requirements-view.component.html',
  styleUrls: ['./exercise-sub-requirements-view.component.scss']
})
export class ExerciseSubRequirementsViewComponent implements OnInit {
  @Input() exercise!: Exercise;
  @Input() editClassRequirement!: ClassRequirement;
  @Output() back: EventEmitter<void> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  editSubRequirement(req: IRequirement) {
    // open the modal sub requirement
  }

  goBackToRequirements() {
    this.back.emit();
  }

}
